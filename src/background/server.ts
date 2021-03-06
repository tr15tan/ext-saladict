import { message, openURL } from '@/_helpers/browser-api'
import { play } from './audio-manager'
import { chsToChz } from '@/_helpers/chs-to-chz'
import { MsgType, MsgOpenUrl, MsgAudioPlay, MsgFetchDictResult } from '@/typings/message'

message.self.initServer()

// background script as transfer station
message.addListener((data, sender: browser.runtime.MessageSender) => {
  switch (data.type) {
    case MsgType.OpenURL:
      return createTab(data as MsgOpenUrl)
    case MsgType.PlayAudio:
      return playAudio(data as MsgAudioPlay)
    case MsgType.FetchDictResult:
      return fetchDictResult(data as MsgFetchDictResult)
    case MsgType.PreloadSelection:
      return preloadSelection()
  }
})

function createTab (data: MsgOpenUrl): Promise<void> {
  return openURL(
    data.placeholder
      ? data.url
        .replace(/%s/g, data.text)
        .replace(/%z/g, chsToChz(data.text))
      : data.url,
    data.self
  )
}

function playAudio (data: MsgAudioPlay): Promise<void> {
  return play(data.src)
}

function fetchDictResult (data: MsgFetchDictResult): Promise<{ result: any, id: typeof data.id }> {
  let search

  try {
    search = require('@/components/dictionaries/' + data.id + '/engine')
    if (typeof search !== 'function') {
      search = search.default
    }
  } catch (err) {
    return Promise.reject(err)
  }

  return search(data.text)
    .then(result => ({ result, id: data.id }))
}

function preloadSelection (): Promise<void> {
  return browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      if (tabs.length > 0 && tabs[0].id != null) {
        return message.send(tabs[0].id as number, { type: MsgType.__PreloadSelection__ })
      }
    })
    .then(text => text || '')
    .catch(() => '')
}
