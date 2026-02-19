// src/common/is-public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // 👈 Usar constante
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);