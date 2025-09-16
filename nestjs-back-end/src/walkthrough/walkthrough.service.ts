import {
  BadRequestException,
  HttpStatus,
  Logger,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from 'src/schemas/departments.schema';
import {
  PeriodicityOptions,
  PerSwingOptions,
  Walkthrough,
  WalkthroughDocument,
  WeeklyOptions,
} from 'src/schemas/walkthroughs.schema';
import { Model } from 'mongoose';
import { Area } from 'src/schemas/areas.schema';
import { DataPoint } from 'src/schemas/DataPoints.schema';
import { LogService } from 'src/log/log.service';
import { Log } from 'src/schemas/logs.schema';

@Injectable()
export class WalkthroughService {
  constructor(
    private logService: LogService,
    @InjectModel(Department.name) private departmentModel: Model<Department>,
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(DataPoint.name) private dataPointModel: Model<DataPoint>,
  ) {}
  private readonly logger = new Logger(WalkthroughService.name);

  async create(createWalkthroughDto: CreateWalkthroughDto) {
    if (!createWalkthroughDto.name || !createWalkthroughDto.department) {
      throw new BadRequestException('Missing name.');
    } else {
      // this.logger.debug('creating walkthrough from:', createWalkthroughDto);
      const DepartmentDocument = await this.departmentModel
        .findOne({
          name: createWalkthroughDto.department,
        })
        .populate('walkthroughs')
        .exec();
      if (!DepartmentDocument) {
        throw new NotFoundException('Department not found', {
          cause: new Error(),
          description: 'Department not found',
        });
      } else {
        const newWalkthrough = new this.walkthroughModel({
          name: createWalkthroughDto.name,
          periodicity:
            createWalkthroughDto?.periodicity || PeriodicityOptions.Daily,
          department: DepartmentDocument,
          nextDueDate: this.createDueDate(
            createWalkthroughDto?.periodicity || PeriodicityOptions.Daily,
            createWalkthroughDto?.weekly,
            createWalkthroughDto?.perSwing,
          ),
          data: [],
          ...(createWalkthroughDto.weekly && {
            weekly: createWalkthroughDto.weekly,
          }),
        });
        // this.logger.debug(newWalkthrough);
        DepartmentDocument.walkthroughs.push(newWalkthrough);
        await DepartmentDocument.save();
        const result = await newWalkthrough.save();
        if (result.errors) {
          throw new InternalServerErrorException(
            'Failed to create walkthrough',
          );
        }
        return { name: result._id };
      }
    }
  }

  async findAll() {
    const deptDoc = await this.departmentModel.find();
    const result: Walkthrough[] = (
      await Promise.all(
        deptDoc.map(async (dept) => {
          const walkthroughs: Walkthrough[] = await this.walkthroughModel
            .find({ department: dept._id })
            .populate('department', '', this.departmentModel);
          // console.log('1 walkthrough:', walkthroughs);
          return walkthroughs;
        }),
      )
    ).flat();

    // console.log('result:', result);
    return result;
  }

  async findAllById(id: string) {
    const deptDoc = await this.departmentModel.find({ _id: id });
    if (!deptDoc || deptDoc.length === 0) {
      throw new NotFoundException('Department not found', {
        cause: new Error(),
        description: 'Department not found',
      });
    }

    const result: Walkthrough[] = (
      await Promise.all(
        deptDoc.map(async (dept) => {
          const walkthroughs: Walkthrough[] = await this.walkthroughModel
            .find({ department: dept._id })
            .populate('department', '', this.departmentModel);
          // console.log('1 walkthrough:', walkthroughs);
          return walkthroughs;
        }),
      )
    ).flat();

    // console.log('result:', result);
    return result;
  }

  async findAllByName(department: string) {
    const deptDoc = await this.departmentModel.find({ name: department });
    // this.logger.log(department, deptDoc);
    if (!deptDoc || deptDoc.length === 0) {
      throw new NotFoundException('Department not found', {
        cause: new Error(),
        description: 'Department not found',
      });
    }
    // console.log('deptDoc:', deptDoc);

    // console.log(deptDoc);
    const result: Walkthrough[] = (
      await Promise.all(
        deptDoc.map(async (dept) => {
          const walkthroughs: Walkthrough[] = await this.walkthroughModel
            .find({ department: dept._id })
            .populate('department', '', this.departmentModel);
          // console.log('1 walkthrough:', walkthroughs);
          return walkthroughs;
        }),
      )
    ).flat();

    // console.log('result:', result);
    return result;
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const walkthroughDoc = await this.walkthroughModel.findById(id);
    await walkthroughDoc.populate('data');
    // console.log(walkthroughDoc);
    return walkthroughDoc;
  }

  async findByName(name: string) {
    if (!name) {
      throw new BadRequestException('Request has no name', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    const walkthroughDoc = await this.walkthroughModel
      .findOne({ name })
      .populate('data');
    return walkthroughDoc;
  }

  async getWalkthroughStatus(id: string) {
    // Need to get walkthrough by id, then look at last log and due date to determine status
    if (!id) {
      throw new BadRequestException('Request has no id', {
        cause: new Error(),
        description: 'Request has no id',
      });
    }
    const walkthroughDoc = await this.walkthroughModel.findById(id);
    if (!walkthroughDoc) {
      throw new NotFoundException('Walkthrough not found', {
        cause: new Error(),
        description: 'Walkthrough not found',
      });
    }
    const { nextDueDate } = walkthroughDoc;
    if (!nextDueDate) {
      throw new NotFoundException('Walkthrough has no due date', {
        cause: new Error(),
        description: 'Walkthrough has no due date',
      });
    }
    let lastLog: Log = null;

    // Get last log for this walkthrough
    try {
      lastLog = await this.logService.findPrev(undefined, id);
    } catch (err) {
      // swallow or log depending on your needs
    }

    const now = new Date();
    let status: 'on-time' | 'late' | 'not-started' = 'on-time';

    if (!lastLog) {
      // If no log exists, and nextDueDate is in the past → late
      status =
        nextDueDate && new Date(nextDueDate) < now ? 'late' : 'not-started';
    } else {
      // If there’s a log, compare nextDueDate with now
      if (nextDueDate && new Date(nextDueDate) < now) {
        status = 'late';
      } else {
        status = 'on-time';
      }
    }

    return {
      walkthroughId: id,
      nextDueDate,
      status,
      lastLog,
    };
  }

  async update(id: string, updateWalkthroughDto: UpdateWalkthroughDto) {
    // This only needs to rename walkthroughs. The areas will now be handled by area route service
    // this.logger.log('updateWalkthroughDto:', updateWalkthroughDto);
    if (!id) {
      throw new BadRequestException('Request did not include id', {
        cause: new Error(),
        description: 'Request did not include id',
      });
    }

    if (
      updateWalkthroughDto.periodicity === 'Weekly' &&
      !updateWalkthroughDto.weekly
    ) {
      throw new BadRequestException('Request did not include weekly', {
        cause: new Error(),
        description: 'Request did not include weekly',
      });
    }

    if (
      updateWalkthroughDto.periodicity === 'Per Swing' &&
      !updateWalkthroughDto.perSwing
    ) {
      throw new BadRequestException('Request did not include perSwing', {
        cause: new Error(),
        description: 'Request did not include perSwing',
      });
    }

    // First we find the walkthrough
    const walkthroughDoc = await this.walkthroughModel.findById(id);
    // Does it exist?
    if (!walkthroughDoc) {
      throw new InternalServerErrorException(
        `Failed to update walkthrough because database did not find ${id}`,
      );
    }

    // Update document
    Object.keys(updateWalkthroughDto).forEach((key) => {
      if (updateWalkthroughDto[key] !== undefined) {
        walkthroughDoc[key] = updateWalkthroughDto[key];
      }
    });
    console.log(updateWalkthroughDto.periodicity);
    if (updateWalkthroughDto.periodicity !== PeriodicityOptions.PerSwing) {
      walkthroughDoc.perSwing = undefined;
    }

    if (updateWalkthroughDto.periodicity !== PeriodicityOptions.Weekly) {
      walkthroughDoc.weekly = undefined;
    }

    if (updateWalkthroughDto.createNewDueDate) {
      walkthroughDoc.nextDueDate = this.createDueDate(
        updateWalkthroughDto.periodicity,
        updateWalkthroughDto.weekly,
        updateWalkthroughDto.perSwing,
        walkthroughDoc.nextDueDate,
      );
    }

    // Save updated walkthrough
    const result = await walkthroughDoc.save();
    if (!result) {
      throw new InternalServerErrorException('Failed to update walkthrough');
    } else {
      return { name: result._id };
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Request is empty', {
        cause: new Error(),
        description: 'Request is empty',
      });
    }
    // Find walkthrough
    const walkthroughDoc = await this.walkthroughModel.findById(id);

    // Find Department that walkthrough belongs to and delete walkthrough
    const deptDoc = await this.departmentModel.findById(
      walkthroughDoc.department,
    );
    const filteredWalkthroughs = deptDoc.walkthroughs.filter(
      (walkthrough) => walkthrough.toString() !== walkthroughDoc._id.toString(),
    );
    deptDoc.walkthroughs = filteredWalkthroughs;
    const resultDept = await deptDoc.save();

    // Find all areas belonging to Walkthrough
    const areaDocs = await this.areaModel.find({ parentWalkthrough: id });

    // Delete all areas
    for (const areaDoc of areaDocs) {
      await this.areaModel.findByIdAndDelete(areaDoc._id);
    }

    // Find all data points belonging to Walkthrough
    const dataPointDocs = await this.dataPointModel.find({
      parentWalkthrough: id,
    });
    // Delete all data points
    for (const dataPointDoc of dataPointDocs) {
      await this.dataPointModel.findByIdAndDelete(dataPointDoc._id);
    }

    const resultWalkthrough = await this.walkthroughModel.findByIdAndDelete(
      walkthroughDoc._id,
    );
    if (!resultDept || !resultWalkthrough) {
      throw new InternalServerErrorException('Failed to remove walkthrough');
    } else {
      return { statusCode: HttpStatus.OK, message: 'Walkthrough removed' };
    }
  }

  private createDueDate(
    periodicity: string,
    weeklyOption?: string,
    perSwingOption?: string,
    pastDueDate?: Date,
  ): Date {
    const { hour, minute } = this.getShiftChangeTime();
    const now = new Date();
    const currentWeekStart = this.getSundayOfWeek();

    // Start of morning shift for "today"
    const morningTime = new Date(now);
    morningTime.setHours(hour, minute, 0, 0);

    // Start of night shift for "today"
    const morningPlus12 = new Date(morningTime);
    morningPlus12.setHours(morningPlus12.getHours() + 12);

    const nextDueDate = new Date(morningTime);
    switch (periodicity) {
      case PeriodicityOptions.PerShift: {
        if (now < morningTime) {
          // Before morning -> due 12h after morning today (due for day shift)
          nextDueDate.setDate(morningPlus12.getDate());
        } else if (now < morningPlus12) {
          // Between morning and 12h later -> due 24h after morning (due for night shift)
          nextDueDate.setDate(nextDueDate.getDate() + 1);
        } else {
          // After 12h later -> due 36h after morning (due for next day shift)
          nextDueDate.setDate(morningPlus12.getDate() + 1);
        }

        return nextDueDate;
      }
      case PeriodicityOptions.Daily: {
        if (now < morningTime) {
          nextDueDate.setDate(nextDueDate.getDate() + 2);
        } else {
          nextDueDate.setDate(nextDueDate.getDate() + 1);
        }

        return nextDueDate;
      }
      case PeriodicityOptions.PerSwing: {
        // get start of current swing then look at perSwingOption to add days
        const swingStart = this.getSwingStartDate();
        switch (perSwingOption) {
          case PerSwingOptions.First: {
            nextDueDate.setDate(swingStart.getDate() + 4);
            break;
          }
          case PerSwingOptions.Second: {
            nextDueDate.setDate(swingStart.getDate() + 5);
            break;
          }
          case PerSwingOptions.Third: {
            nextDueDate.setDate(swingStart.getDate() + 6);
            break;
          }
          case PerSwingOptions.Fourth: {
            nextDueDate.setDate(swingStart.getDate() + 7);
            break;
          }
        }
        return nextDueDate;
      }
      case PeriodicityOptions.Weekly: {
        nextDueDate.setDate(
          this.getWeeklyOptionDate(
            weeklyOption,
            currentWeekStart,
            nextDueDate,
            1,
          ).getDate(),
        );
        return nextDueDate;
      }
      case PeriodicityOptions.BiWeekly: {
        if (pastDueDate) {
          const pastDue = new Date(pastDueDate);
          pastDue.setHours(hour, minute, 0, 0);
          if (now > new Date(pastDueDate.getDate() + 14)) {
            nextDueDate.setDate(
              this.getWeeklyOptionDate(
                weeklyOption,
                currentWeekStart,
                nextDueDate,
                2,
              ).getDate(),
            );
          } else {
            nextDueDate.setDate(pastDue.getDate() + 14);
          }
        } else {
          nextDueDate.setDate(
            this.getWeeklyOptionDate(
              weeklyOption,
              currentWeekStart,
              nextDueDate,
              2,
            ).getDate(),
          );
        }
        return nextDueDate;
      }
      case PeriodicityOptions.Monthly: {
        if (pastDueDate) {
          // Calculate difference in months
          const monthDiff =
            (now.getFullYear() - pastDueDate.getFullYear()) * 12 +
            (now.getMonth() - pastDueDate.getMonth());

          if (monthDiff >= 1) {
            // Clamp the day to avoid overflow (e.g. Feb 30 → Feb 28)
            const targetMonth = pastDueDate.getMonth() + monthDiff + 1;
            const targetYear =
              pastDueDate.getFullYear() + Math.floor(targetMonth / 12);
            const targetMonthIndex = targetMonth % 12;

            const daysInTargetMonth = new Date(
              targetYear,
              targetMonthIndex + 1,
              0,
            ).getDate();
            const targetDay = Math.min(
              pastDueDate.getDate(),
              daysInTargetMonth,
            );

            nextDueDate.setFullYear(targetYear, targetMonthIndex, targetDay);
            return nextDueDate;
          }
        } else {
          // No pastDueDate → push nextDueDate to the 1st of next month
          const targetMonth = now.getMonth() + 1;
          const targetYear = now.getFullYear() + Math.floor(targetMonth / 12);
          const targetMonthIndex = targetMonth % 12;

          nextDueDate.setFullYear(targetYear, targetMonthIndex, 1);
          return nextDueDate;
        }
      }
    }
  }

  private getSwingStartDate(): Date {
    const reference = new Date('2025-08-24'); // Start of a known swing cycle
    const msInDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const { hour, minute } = this.getShiftChangeTime();
    reference.setHours(hour, minute, 0, 0);
    now.setHours(hour, minute, 0, 0);

    // Number of full days difference
    const diffDays = Math.floor(
      (now.getTime() - reference.getTime()) / msInDay,
    );

    const remainder = diffDays % 4;

    const swingStart = new Date(now);
    swingStart.setDate(swingStart.getDate() - remainder);
    return swingStart;
  }

  private getSundayOfWeek(date: Date = new Date()): Date {
    const { hour, minute } = this.getShiftChangeTime();
    const day = date.getDay(); // 0=Sun, 1=Mon, ...
    const diffToSunday = (day + 6) % 7; // days since Sunday
    const sundayOfWeek = new Date(date);
    sundayOfWeek.setDate(sundayOfWeek.getDate() - diffToSunday);
    sundayOfWeek.setHours(hour, minute, 0, 0); // set to morning shift turnover time
    return sundayOfWeek;
  }

  private getWeeklyOptionDate(
    weeklyOption: string,
    currentWeekStart: Date,
    nextDueDate: Date,
    offsetWeeks = 1,
  ): Date {
    switch (weeklyOption) {
      case WeeklyOptions.Sunday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks);
        break;
      }
      case WeeklyOptions.Monday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 1);
        break;
      }
      case WeeklyOptions.Tuesday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 2);
        break;
      }
      case WeeklyOptions.Wednesday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 3);
        break;
      }
      case WeeklyOptions.Thursday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 4);
        break;
      }
      case WeeklyOptions.Friday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 5);
        break;
      }
      case WeeklyOptions.Saturday: {
        nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 6);
        break;
      }
    }
    return nextDueDate;
  }

  private isWithinAllowedWindow(logTime: Date, periodicity: string): boolean {
    const timeNow = new Date();
    const { hour, minute } = this.getShiftChangeTime();
    const windowStart = new Date();
    const windowEnd = new Date();
    const msInHour = 1000 * 60 * 60;
    const msInDay = msInHour * 24;

    let allowedWindowMs = 0;

    switch (periodicity) {
      case PeriodicityOptions.PerShift:
        const currentShiftStart = new Date();
        currentShiftStart.setHours(hour, minute, 0, 0);
        if (timeNow < currentShiftStart) {
          currentShiftStart.setHours(currentShiftStart.getHours() - 12);
        }
        windowStart.setDate(currentShiftStart.getHours() - 12);
        break;
      case PeriodicityOptions.Daily:
        const currentDayStart = new Date();
        currentDayStart.setHours(hour, minute, 0, 0);
        windowStart.setDate(currentDayStart.getDate() - 1);
        break;
      case PeriodicityOptions.PerSwing:
        allowedWindowMs = msInDay * 4;
        break;
      case PeriodicityOptions.Weekly:
        const currentWindowStart = this.getLastMonday();
        windowStart.setDate(currentWindowStart.getDate() - 7);
        break;
      case PeriodicityOptions.BiWeekly:
        allowedWindowMs = msInDay * 14;
        break;
      case PeriodicityOptions.Monthly:
        allowedWindowMs = msInDay * 30;
        break;
      default:
        allowedWindowMs = msInDay; // Default to daily if unknown
    }

    const timeDiff = timeNow.getTime() - logTime.getTime();

    if (timeDiff < allowedWindowMs) {
      return true;
    } else {
      return false;
    }
  }
  private getLastMonday(): Date {
    const { hour, minute } = this.getShiftChangeTime();
    const lastMonday = new Date();
    const day = lastMonday.getDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = (day + 6) % 7; // days since Monday
    lastMonday.setDate(lastMonday.getDate() - diffToMonday);
    lastMonday.setHours(hour, minute, 0, 0); // set to 8:00 AM
    if (new Date() < lastMonday) {
      // if current time is before today's Monday 8am, go to previous Monday
      lastMonday.setDate(lastMonday.getDate() - 7);
    }
    return lastMonday;
  }

  private getShiftChangeTime(): { hour: number; minute: number } {
    // Default to 8:00 if not provided
    const shiftEnv = process.env.SHIFT_CHANGE || '8:00';
    const [hourStr, minuteStr] = shiftEnv.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr ? parseInt(minuteStr, 10) : 0;
    return { hour: isNaN(hour) ? 8 : hour, minute: isNaN(minute) ? 0 : minute };
  }
}
