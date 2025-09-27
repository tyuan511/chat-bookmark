import type { ModelSettingType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'

import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { modelSettingSchema, ModelType } from '@/lib/types'
import { useStore } from '../../store'

const modelTypes = [
  { value: ModelType.LLM, label: '大语言模型' },
  { value: ModelType.EMBEDDING, label: '嵌入模型' },
] as const

export function ModelSettingPage() {
  const { modelSetting, saveModelSetting } = useStore()

  const form = useForm<ModelSettingType>({
    // FIXME: 临时使用 any 解决类型问题
    resolver: zodResolver(modelSettingSchema as any),
    defaultValues: modelSetting ?? {
      baseUrl: 'https://api.openai.com',
      apiKey: '',
      models: [
        {
          modelName: '',
          modelType: 'llm',
        },
      ],
    },
  }) as any // 临时使用 any 解决类型问题

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'models',
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async (values: ModelSettingType) => {
    setLoading(true)
    await saveModelSetting(values).finally(() => setLoading(false))
    toast.success('模型设置已保存')
  }, [saveModelSetting])

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">模型设置</h1>
        <p className="text-muted-foreground">
          配置您的 OpenAI 兼容 API 设置
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://api.openai.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  OpenAI 兼容 API 的基础 URL 地址
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API 密钥</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  您的 OpenAI API 密钥或其他兼容服务的密钥
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>模型配置</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ modelName: '', modelType: 'llm' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                添加模型
              </Button>
            </div>
            <FormDescription>
              配置您要使用的模型，每个模型都需要设置名称和类型。默认类型为大语言模型。
            </FormDescription>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex gap-10">
                  <div className="flex-1 flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`models.${index}.modelName`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>模型名称</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="gpt-3.5-turbo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`models.${index}.modelType`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>模型类型</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="选择模型类型" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {modelTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive mt-5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

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
    </div>
  )
}
