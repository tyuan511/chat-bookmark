import { z } from 'zod'

export type BookMarkNode = Browser.bookmarks.BookmarkTreeNode & {
  path: string
}

export enum ModelType {
  LLM = 'llm',
  EMBEDDING = 'embedding',
}

export const modelSchema = z.object({
  modelName: z.string().min(1, '模型名称不能为空'),
  modelType: z.string().min(1, '模型类型不能为空'),
})

export const modelSettingSchema = z.object({
  baseUrl: z.url('请输入有效的URL地址'),
  apiKey: z.string().min(1, 'API密钥不能为空'),
  models: z.array(modelSchema).min(1, '至少需要添加一个模型'),
})

export type ModelSettingType = z.infer<typeof modelSettingSchema>

export const supabaseSettingSchema = z.object({
  supabaseUrl: z.url('请输入有效的Supabase URL').regex(/https:\/\/[\w-]+\.supabase\.co/, '请输入有效的Supabase项目URL'),
  supabaseAnonKey: z.string().min(1, 'Anon Key不能为空'),
})

export type SupabaseSettingType = z.infer<typeof supabaseSettingSchema>

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const systemSettingSchema = z.object({
  theme: z.enum(Theme, '请选择一个主题'),
  language: z.string().min(1, '请选择一种语言'),
  llmModelName: z.string().min(1, '请选择一个LLM模型'),
  embeddingModelName: z.string().min(1, '请选择一个Embedding模型'),
  embeddingDimensions: z.number().min(1, '嵌入模型维度必须大于0').max(4096, '嵌入模型维度不能超过4096'),
})

export type SystemSettingType = z.infer<typeof systemSettingSchema>
