import { Module } from "@nestjs/common";
import { GitC } from "./git.controller";

/**
 * git模块
 */
@Module({
    imports: [],
    controllers: [GitC],
})
export class GitM { }