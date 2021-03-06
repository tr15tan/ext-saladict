import { AppConfig, appConfigFactory } from '@/app-config'
import { storage, StorageListenerCb } from './browser-api'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { concat } from 'rxjs/observable/concat'

export type AppConfigChanged = {
  config: {
    newValue: AppConfig,
    oldValue?: AppConfig,
  }
}

export function getAppConfig (): Promise<AppConfig> {
  return storage.sync.get<{ config?: AppConfig }>('config')
    .then(({ config }) => {
      if (config && typeof config.version) {
        return config
      }
      return appConfigFactory()
    })
}

export function setAppConfig (config: AppConfig): Promise<void> {
  return storage.sync.set({ config })
}

export function addAppConfigListener (cb: StorageListenerCb): void {
  return storage.sync.addListener('config', cb)
}

/**
 * Get AppConfig and create a stream listening config changing
 */
export function createAppConfigStream (): Observable<AppConfig> {
  return concat<AppConfig>(
    fromPromise(getAppConfig()),
    storage.createStream<AppConfigChanged>('config').pipe(map(x => x.config.newValue)),
  )
}

export const appConfig = {
  get: getAppConfig,
  set: setAppConfig,
  addListener: addAppConfigListener,
  createStream: createAppConfigStream,
}
