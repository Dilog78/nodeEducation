import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileResponseInterface } from "./types/profileResponse.interface";

@Controller('profiles')

export class ProfileController {
    constructor(private readonly profileService: ProfileService){}
    
    @Get(':username')
    async getProfile(@User('id') id: number, @Param('username') profileName: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileService.getProfile(id, profileName);
        return this.profileService.profileResponce(profile);
    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User('id') userId: number, @Param('username') profileName: string):
    Promise<ProfileResponseInterface> {
        const profile = await this.profileService.followProfile(userId, profileName);
        return this.profileService.profileResponce(profile);
    }

    @Delete(':username/follow')
    @UseGuards(AuthGuard)
    async unFollow(@User('id') userId: number, @Param('username') profileName: string):
    Promise<ProfileResponseInterface> {
        const profile = await this.profileService.UnFollow(userId, profileName);
        return this.profileService.profileResponce(profile);
    }
}