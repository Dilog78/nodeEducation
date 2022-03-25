import { User } from "@app/user/decorators/user.decorator";
import { Controller, Get, Param } from "@nestjs/common";
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
}