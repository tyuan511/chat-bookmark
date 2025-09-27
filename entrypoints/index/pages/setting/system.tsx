import type { SystemSettingType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'

import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ModelType, systemSettingSchema, Theme } from '@/lib/types'
import { useStore } from '../../store'

export function SystemSettingPage() {
  const { systemSetting, saveSystemSetting, modelSetting, syncSavedModelSetting } = useStore()
  const [loading, setLoading] = useState(false)

  // 获取模型设置
  useEffect(() => {
    syncSavedModelSetting()
  }, [syncSavedModelSetting])

  // 从模型设置中获取可用的模型
  const llmModels = modelSetting?.models.filter(model => model.modelType === ModelType.LLM) || []
  const embeddingModels = modelSetting?.models.filter(model => model.modelType === ModelType.EMBEDDING) || []

  const form = useForm<SystemSettingType>({
    resolver: zodResolver(systemSettingSchema as any),
    defaultValues: systemSetting ?? {
      theme: Theme.SYSTEM,
      language: 'zh-CN',
      llmModelName: '',
      embeddingModelName: '',
    },
  })

  const onSubmit = useCallback(async (values: SystemSettingType) => {
    setLoading(true)
    await saveSystemSetting(values).finally(() => setLoading(false))
    toast.success('系统设置已保存')
  }, [saveSystemSetting])

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">系统设置</h1>
        <p className="text-muted-foreground">
          配置您的应用偏好设置和模型选择
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>主题</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择一个主题" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Theme.SYSTEM}>跟随系统</SelectItem>
                    <SelectItem value={Theme.LIGHT}>浅色</SelectItem>
                    <SelectItem value={Theme.DARK}>深色</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  选择应用的主题模式
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>语言</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择语言" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="zh-CN">简体中文</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  选择应用的显示语言
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="llmModelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>大语言模型</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择一个大语言模型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {llmModels.length > 0
                      ? (
                          llmModels.map((model, index) => (
                            <SelectItem key={index} value={model.modelName}>
                              {model.modelName}
                            </SelectItem>
                          ))
                        )
                      : (
                          <SelectItem disabled value="">
                            请先设置模型
                          </SelectItem>
                        )}
                  </SelectContent>
                </Select>
                {llmModels.length === 0 && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>未找到大语言模型</AlertTitle>
                    <AlertDescription>
                      请先前往
                      <a href="#/setting/model" className="underline">模型设置</a>
                      中添加大语言模型
                    </AlertDescription>
                  </Alert>
                )}
                <FormDescription>
                  选择用于对话和文本生成的主要语言模型
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="embeddingModelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>嵌入模型</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择一个嵌入模型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {embeddingModels.length > 0
                      ? (
                          embeddingModels.map((model, index) => (
                            <SelectItem key={index} value={model.modelName}>
                              {model.modelName}
                            </SelectItem>
                          ))
                        )
                      : (
                          <SelectItem disabled value="">
                            请先设置模型
                          </SelectItem>
                        )}
                  </SelectContent>
                </Select>
                {embeddingModels.length === 0 && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>未找到嵌入模型</AlertTitle>
                    <AlertDescription>
                      请先前往
                      <a href="#/setting/model" className="underline">模型设置</a>
                      中添加嵌入模型
                    </AlertDescription>
                  </Alert>
                )}
                <FormDescription>
                  选择用于文本向量化的嵌入模型
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" loading={loading}>保存设置</Button>
            <Button
              disabled={loading}
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              重置
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2">设置说明</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>主题设置会影响整个应用的外观</li>
          <li>语言设置会改变界面显示语言</li>
          <li>大语言模型用于对话和文本生成功能</li>
          <li>嵌入模型用于文本向量化和相似度计算</li>
        </ul>
      </div>
    </div>
  )
}
