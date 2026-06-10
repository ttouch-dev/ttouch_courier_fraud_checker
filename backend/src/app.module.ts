import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { SearchModule } from "./modules/search/search.module";
import { PlansModule } from "./modules/plans/plans.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { CouriersModule } from "./modules/couriers/couriers.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    SearchModule,
    PlansModule,
    PaymentsModule,
    CouriersModule,
    DashboardModule,
  ],
})
export class AppModule {}