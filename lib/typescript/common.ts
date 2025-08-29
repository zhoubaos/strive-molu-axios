import { AxiosResponse } from 'axios';
import { FlagKeys } from './error';

export type AxiosFlagResponse = AxiosResponse & { flag?: FlagKeys };
