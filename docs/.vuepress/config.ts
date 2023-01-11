import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
    title: 'MASA Docs',
    description: 'Temp docs for MASA Stack projects',
    theme: 'reco',
    themeConfig: {
        style: '@vuepress-reco/style-default',
        logo: 'https://cdn.masastack.com/stack/images/logo/MASAStack/logo.png',
        author: 'MASA Team',
        docsRepo: 'https://github.com/masastack/MASA.Docs',
        docsBranch: 'main',
        docsDir: 'docs',
        lastUpdatedText: '',
        // series 为原 sidebar
        series: {
            '/stack/': [
                {
                    text: 'MASA Stack',
                    children: [
                        '/stack/guide/introduce',
                        '/stack/guide/architecture',
                    ]
                },
                {
                    text: 'PM',
                    children: [
                        '/stack/pm/guide/introduce',
                        '/stack/pm/guide/architecture',
                        '/stack/pm/guide/quick-get-started/basic-concepts',
                        '/stack/pm/guide/quick-get-started/use-guide',
                        '/stack/pm/guide/sdk-instance',
                        '/stack/pm/guide/best-practices',
                        '/stack/pm/guide/related-agreements',
                        '/stack/pm/guide/faq',
                    ]
                },
                {
                    text: 'Auth',
                    children: [
                        '/stack/auth/guides/user/introduce',
                        '/stack/auth/guides/team/introduce',
                        '/stack/auth/guides/permission/introduce',
                        '/stack/auth/guides/permission/develop-role',
                        '/stack/auth/guides/org/introduce',
                        '/stack/auth/guides/identity-provider/introduce',
                        '/stack/auth/guides/identity-provider/develop',
                        '/stack/auth/guides/position/introduce',
                        '/stack/auth/guides/sso/userClaim',
                        '/stack/auth/guides/sso/identityResource',
                        '/stack/auth/guides/sso/apiScope',
                        '/stack/auth/guides/sso/apiResource',
                        '/stack/auth/guides/sso/client',
                        '/stack/auth/reference/sdk/auth',
                        '/stack/auth/reference/sdk/sso',
                        '/stack/auth/reference/develop/permission',
                        '/stack/auth/guides/operationLog/introduce',
                        '/stack/auth/guides/swagger/introduce',
                    ]
                },
                {
                    text: 'DCC',
                    children: [
                        '/stack/dcc/guide/introduce',
                        '/stack/dcc/guide/architecture',
                        '/stack/dcc/guide/quick-get-started/basic-concepts',
                        '/stack/dcc/guide/quick-get-started/use-guide',
                        '/stack/dcc/guide/sdk-instance',
                        '/stack/dcc/guide/best-practices',
                        '/stack/dcc/guide/related-agreements',
                        '/stack/dcc/guide/faq',
                    ]
                },
                {
                    text: 'Mc',
                    children: [
                        '/stack/mc/introduce/introduce',
                        '/stack/mc/guides/channel',
                        '/stack/mc/guides/messageTemplate',
                        '/stack/mc/guides/receiverGroup',
                        '/stack/mc/guides/sendMessage',
                        '/stack/mc/guides/messageRecord',
                        '/stack/mc/sdk/mc',
                        '/stack/mc/practices/best-practices',
                        '/stack/mc/faq/faq',
                        '/stack/mc/agreement/related-agreements',
                    ]
                }
            ],
            '/framework/': [
                {
                    text: '基础概念',
                    children: [
                        '/framework/concepts/overview',
                        '/framework/concepts/building-blocks-concept',
                        '/framework/concepts/observability',
                        '/framework/concepts/security',
                        '/framework/concepts/modern-application',
                        '/framework/concepts/terminology',
                        '/framework/concepts/faq',
                    ]
                },
                {
                    text: '快速入门',
                    children: [
                        '/framework/getting-started',
                        '/framework/getting-started/template',
                        '/framework/getting-started/demo'
                    ]
                },
                {
                    text: '现代应用最佳实践',
                    children: [
                        '/framework/practices',
                    ]
                },
                {
                    text: '构建块',
                    children: [
                        '/framework/building-blocks/authentication',
                        '/framework/building-blocks/configuration',
                        '/framework/building-blocks/data',
                        '/framework/building-blocks/ddd',
                        '/framework/building-blocks/dispatcher',
                        // '/framework/building-blocks/bindings',
                        '/framework/building-blocks/isolation',
                        '/framework/building-blocks/observability',
                        '/framework/building-blocks/search-engine',
                        '/framework/building-blocks/service',
                        '/framework/building-blocks/development',
                        '/framework/building-blocks/r-w-spliting',
                        '/framework/building-blocks/caching',
                        '/framework/building-blocks/storage',
                        // '/framework/building-blocks/testable',
                        // '/framework/building-blocks/consistency',
                        // '/framework/building-blocks/aop',
                        '/framework/building-blocks/i18n',
                        '/framework/building-blocks/exceptions',
                        '/framework/building-blocks/rule-engine',
                        '/framework/building-blocks/stack-sdks'
                    ]
                },
                {
                    text: '工具包',
                    children: [
                        // '/framework/utils/configuration',
                        '/framework/utils/data',
                        '/framework/utils/extensions',
                        '/framework/utils/ldap',
                        // '/framework/utils/model',
                        '/framework/utils/security'
                    ]
                },
                {
                    text: '升级指南',
                    children: [
                        '/framework/upgrade/0.6.0',
            '/framework/upgrade/0.7.0',
                    ]
                },
                {
                    text: '参考',
                    children: [
                        '/framework/reference',
                    ]
                },
                // {
                //   text: '贡献',
                //   children: [
                //     '/framework/contributing',
                //   ]
                // }
            ]
        },
        navbar:
            [
                { text: '首页', link: '/' },
                {
                    text: 'MASA Stack',
                    children: [
                        { text: 'MASA Stack', link: '/stack/guide/introduce' },
                        { text: '项目管理(PM)', link: '/stack/pm/guide/introduce' },
                        { text: '权限中心(Auth)', link: '/stack/auth/guides/user/introduce' },
                        { text: '分布式配置中心(DCC)', link: '/stack/dcc/guide/introduce' },
                        { text: '消息中心(Mc)', link: '/stack/mc/introduce/introduce' }
                    ]
                },
                { text: 'MASA Framework', link: '/framework/concepts' },
                {
                    text: '组件库',
                    children: [
                        { text: 'MASA Blazor', link: 'https://github.com/BlazorComponent/MASA.Blazor' },
                        { text: 'MASA Blazor Pro', link: 'https://github.com/BlazorComponent/MASA.Blazor.Pro' },
                        { text: 'MASA Blazor Admin', link: 'https://github.com/masalabs/MASA.Framework.Admin' },
                        { text: 'Blazor Component', link: 'https://github.com/BlazorComponent/BlazorComponent' }
                    ]
                },
            ],
        bulletin: {
            body: [
                {
                    type: 'text',
                    content: `🎉🎉🎉 MASA Stack预计今年将会发布1.0版本。`,
                    style: 'font-size: 16px; font-weight: bold;'
                },
                {
                    type: 'hr',
                },
                {
                    type: 'title',
                    content: 'QQ 群',
                },
                {
                    type: 'text',
                    content: `
          <ul>
            <li>QQ群1：7424099</li>
          </ul>`,
                    style: 'font-size: 12px;'
                },
                {
                    type: 'hr',
                },
                {
                    type: 'title',
                    content: 'GitHub',
                },
                {
                    type: 'text',
                    content: `
          <ul>
            <li><a href="https://github.com/masastack">MASA Stack开源产品<a/></li>
          </ul>`,
                    style: 'font-size: 12px;'
                },
                // {
                //   type: 'hr',
                // },
                // {
                //   type: 'buttongroup',
                //   children: [
                //     {
                //       text: 'test',
                //       link: '/docs/others/test.html'
                //     }
                //   ]
                // }
            ],
        },
        // valineConfig 配置与 1.x 一致
        // valineConfig: {
        //   appId: 'xxx',
        //   appKey: 'xxx',
        //   placeholder: '填写邮箱可以收到回复提醒哦！',
        //   verify: true, // 验证码服务
        //   // notify: true,
        //   recordIP: true,
        //   // hideComments: true // 隐藏评论
        // },
    },
    // debug: true,
})
