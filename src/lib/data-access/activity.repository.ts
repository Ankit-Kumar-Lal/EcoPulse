import { prisma } from "../prisma";
import { ActivityInput } from "../validations/activity";
import { CalculationOutput } from "../calculations/types";

export class ActivityRepository {
  static async create(
    userId: string,
    input: ActivityInput,
    calc: CalculationOutput
  ) {
    return prisma.activity.create({
      data: {
        userId,
        category: input.category,
        activityType: input.activityType,
        amount: input.amount,
        unit: input.unit,
        date: new Date(input.date),
        note: input.note || null,
        calculatedKgCO2e: calc.calculatedKgCO2e,
        factorSource: calc.factorSource,
        factorVersion: calc.factorVersion,
        factorValue: calc.factorValue,
        estimationMethod: calc.estimationMethod,
        dataClassification: calc.dataClassification,
      },
    });
  }

  static async findByIdAndUser(id: string, userId: string) {
    return prisma.activity.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  static async update(
    id: string,
    userId: string,
    input: ActivityInput,
    calc: CalculationOutput
  ) {
    // Enforce server-side ownership authorization
    const existing = await this.findByIdAndUser(id, userId);
    if (!existing) {
      return null;
    }

    return prisma.activity.update({
      where: { id },
      data: {
        category: input.category,
        activityType: input.activityType,
        amount: input.amount,
        unit: input.unit,
        date: new Date(input.date),
        note: input.note || null,
        calculatedKgCO2e: calc.calculatedKgCO2e,
        factorSource: calc.factorSource,
        factorVersion: calc.factorVersion,
        factorValue: calc.factorValue,
        estimationMethod: calc.estimationMethod,
      },
    });
  }

  static async delete(id: string, userId: string) {
    // Enforce server-side ownership authorization
    const existing = await this.findByIdAndUser(id, userId);
    if (!existing) {
      return false;
    }

    await prisma.activity.delete({
      where: { id },
    });
    return true;
  }

  static async list(
    userId: string,
    filters: {
      category?: string;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId,
      ...(filters.category &&
        filters.category !== "ALL" && { category: filters.category }),
      ...(filters.startDate || filters.endDate
        ? {
            date: {
              ...(filters.startDate && { gte: filters.startDate }),
              ...(filters.endDate && { lte: filters.endDate }),
            },
          }
        : {}),
    };

    const [items, totalCount] = await Promise.all([
      prisma.activity.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.activity.count({ where: whereClause }),
    ]);

    return {
      items,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
    };
  }

  static async getSummaryForPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    const activities = await prisma.activity.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        category: true,
        calculatedKgCO2e: true,
        date: true,
      },
    });

    const totalKgCO2e = activities.reduce(
      (sum, item) => sum + item.calculatedKgCO2e,
      0
    );

    const categoryMap: Record<string, number> = {};
    for (const item of activities) {
      categoryMap[item.category] =
        (categoryMap[item.category] || 0) + item.calculatedKgCO2e;
    }

    return {
      totalKgCO2e: Math.round(totalKgCO2e * 100) / 100,
      recordCount: activities.length,
      categoryBreakdown: categoryMap,
      activities,
    };
  }
}
