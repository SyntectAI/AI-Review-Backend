/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsString, IsUrl, ValidateNested } from 'class-validator';

class CodeReviewPullRequestDto {
  @IsUrl()
  diff_url: string;

  @IsUrl()
  html_url: string;

  @IsNumber()
  number: number;

  @IsString()
  title: string;
}

class CodeReviewRepositoryDto {
  @IsString()
  name: string;

  @IsObject()
  owner: {
    login: string;
  };
}

export class CodeReviewRequestDto {
  @ValidateNested()
  @Type(() => CodeReviewPullRequestDto)
  pull_request: CodeReviewPullRequestDto;

  @ValidateNested()
  @Type(() => CodeReviewRepositoryDto)
  repository: CodeReviewRepositoryDto;
}
