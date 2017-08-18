/**
 * Callbackable type
 */
import { AppModel } from './app-model';

export interface Callbackable {
    setupValue(result: AppModel);
}