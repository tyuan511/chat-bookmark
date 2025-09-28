import type { SupabaseSettingType } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
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
import { supabaseSettingSchema } from '@/lib/types'
import { useStore } from '../../store'

export function SupabaseSettingPage() {
  const { supabaseSetting, saveSupabaseSetting } = useStore()

  const form = useForm<SupabaseSettingType>({
    resolver: zodResolver(supabaseSettingSchema as any),
    defaultValues: supabaseSetting ?? {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async (values: SupabaseSettingType) => {
    setLoading(true)
    await saveSupabaseSetting(values).finally(() => setLoading(false))
    toast.success('Supabase 设置已保存')
  }, [saveSupabaseSetting])

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase 设置</h1>
        <p className="text-muted-foreground">
          配置您的 Supabase 项目连接信息
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="supabaseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supabase 项目 URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-project.supabase.co"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  您的 Supabase 项目 URL，格式为 https://your-project.supabase.co
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supabaseAnonKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supabase Publishable Key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  您的 Supabase 项目的 Publishable Key，用于客户端 API 调用
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" loading={loading}>
              保存设置
            </Button>
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
        <h3 className="text-sm font-medium mb-2">如何获取 Supabase 配置信息？</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>登录您的 Supabase 控制台</li>
          <li>选择您的项目</li>
          <li>点击左侧菜单中的 Settings → API</li>
          <li>复制 Project URL 和 anon public key</li>
        </ol>
      </div>
    </div>
  )
}
