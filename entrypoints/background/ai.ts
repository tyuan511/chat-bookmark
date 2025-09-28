import type { ModelSettingType, SystemSettingType } from '@/lib/types'
import { createOpenAI } from '@ai-sdk/openai'
import { embed as embedImpl, generateObject as generateObjectImpl } from 'ai'

export async function generateObject(params: Omit<Parameters<typeof generateObjectImpl>[0], 'model'>): ReturnType<typeof generateObjectImpl> {
  const { modelSetting } = await browser.storage.sync.get<{ modelSetting: ModelSettingType }>('modelSetting')
  const { systemSetting } = await browser.storage.sync.get<{ systemSetting: SystemSettingType }>('systemSetting')
  const openai = createOpenAI({
    baseURL: modelSetting.baseUrl,
    apiKey: modelSetting.apiKey,
  })

  return generateObjectImpl({
    ...params,
    model: openai.chat(systemSetting.llmModelName),
  } as any)
}

export async function embed(params: Omit<Parameters<typeof embedImpl>[0], 'model'>): ReturnType<typeof embedImpl> {
  const { modelSetting } = await browser.storage.sync.get<{ modelSetting: ModelSettingType }>('modelSetting')
  const { systemSetting } = await browser.storage.sync.get<{ systemSetting: SystemSettingType }>('systemSetting')
  const openai = createOpenAI({
    baseURL: modelSetting.baseUrl,
    apiKey: modelSetting.apiKey,
  })

  return embedImpl({
    ...params,
    model: openai.textEmbedding(systemSetting.embeddingModelName),
    providerOptions: {
      openai: {
        dimensions: systemSetting.embeddingDimensions,
      },
    },
  })
}
