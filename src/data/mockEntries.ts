import { Entry } from '../types';

export const mockEntries: Entry[] = [
  {
    id: 'entry-1',
    title: '员工入职指南',
    content: `<h2>欢迎加入我们的团队</h2>
<p>本指南将帮助您快速了解公司文化、制度和日常工作流程。</p>

<h3>一、入职流程</h3>
<ol>
<li>在HR部门办理入职手续,签署劳动合同</li>
<li>领取工牌、门禁卡和办公用品</li>
<li>IT部门为您开通邮箱和系统账号</li>
<li>部门负责人进行岗位培训和介绍</li>
</ol>

<h3>二、公司文化</h3>
<p>我们秉承"创新、合作、责任、共赢"的价值观,致力于为客户创造价值,为员工提供发展平台。</p>

<h3>三、日常规范</h3>
<ul>
<li>工作时间: 周一至周五 9:00-18:00</li>
<li>考勤打卡: 每天上下班需打卡签到</li>
<li>着装要求: 商务休闲装</li>
<li>会议礼仪: 准时参加会议,手机静音</li>
</ul>

<h3>四、联系方式</h3>
<p>如有疑问,请联系人力资源部: ext. 8001</p>`,
    summary: '帮助新员工快速了解公司文化、制度和日常工作流程的入门指南',
    categoryId: 'cat-2',
    departmentId: 'dept-4',
    tags: ['入职', '新员工', '指南'],
    authorId: 'user-1',
    authorName: '张小明',
    createdAt: '2025-12-15',
    updatedAt: '2026-06-01',
    version: 3,
    isOfficial: true,
    scope: 'all',
    attachments: [
      {
        id: 'att-1',
        name: '入职手续清单.pdf',
        url: '/files/checklist.pdf',
        size: 245000,
        type: 'application/pdf',
        uploadedAt: '2025-12-15',
      },
    ],
    status: 'approved',
    viewCount: 1256,
    favoriteCount: 89,
    commentCount: 23,
  },
  {
    id: 'entry-2',
    title: '请假管理制度',
    content: `<h2>请假管理制度</h2>

<h3>第一章 总则</h3>
<p>为规范公司请假管理,保障正常工作秩序,特制定本制度。</p>

<h3>第二章 请假类型</h3>
<h4>1. 年假</h4>
<ul>
<li>员工入职满一年后享受年假</li>
<li>工作年限1-10年: 年假5天</li>
<li>工作年限10-20年: 年假10天</li>
<li>工作年限20年以上: 年假15天</li>
</ul>

<h4>2. 病假</h4>
<p>员工因病需要休息的,应提前申请病假。突发性疾病可事后补办手续。</p>

<h4>3. 事假</h4>
<p>因私事需要请假,需提前1天申请,单次不超过3天。</p>

<h4>4. 婚假、产假、丧假</h4>
<p>按照国家规定执行,具体假期天数以国家法律法规为准。</p>

<h3>第三章 请假流程</h3>
<ol>
<li>员工在OA系统提交请假申请</li>
<li>直属上级审批</li>
<li>HR部门备案</li>
<li>审批通过后生效</li>
</ol>

<h3>第四章 注意事项</h3>
<ul>
<li>请假前需完成工作交接</li>
<li>紧急情况可先电话告知,事后补办手续</li>
<li>虚报请假理由者将受到相应处分</li>
</ul>`,
    summary: '公司员工请假申请、审批及管理的相关规定',
    categoryId: 'cat-2',
    departmentId: 'dept-4',
    tags: ['请假', '人事', '管理制度'],
    authorId: 'user-1',
    authorName: '张小明',
    createdAt: '2025-11-20',
    updatedAt: '2026-05-15',
    version: 2,
    isOfficial: true,
    scope: 'all',
    attachments: [],
    status: 'approved',
    viewCount: 987,
    favoriteCount: 56,
    commentCount: 15,
  },
  {
    id: 'entry-3',
    title: '差旅报销制度',
    content: `<h2>差旅报销管理制度</h2>

<h3>一、报销标准</h3>
<h4>1. 交通费用</h4>
<ul>
<li>飞机票: 经济舱,需提前申请并经批准</li>
<li>火车票: 高铁二等座或普通列车硬卧</li>
<li>市内交通: 实报实销,需提供发票</li>
</ul>

<h4>2. 住宿费用</h4>
<ul>
<li>一线城市: 不超过500元/晚</li>
<li>二线城市: 不超过350元/晚</li>
<li>其他城市: 不超过250元/晚</li>
</ul>

<h4>3. 餐饮补贴</h4>
<ul>
<li>国内出差: 100元/天</li>
<li>国外出差: 200元/天</li>
</ul>

<h3>二、报销流程</h3>
<ol>
<li>出差前填写出差申请,明确预算</li>
<li>出差期间保留所有票据</li>
<li>出差结束后5个工作日内提交报销</li>
<li>财务部门审核后7个工作日内打款</li>
</ol>

<h3>三、注意事项</h3>
<ul>
<li>超标准部分需提前申请特批</li>
<li>发票需为正规增值税发票</li>
<li>虚假报销将追究责任</li>
</ul>`,
    summary: '员工出差费用报销的标准、流程和注意事项',
    categoryId: 'cat-3',
    departmentId: 'dept-5',
    tags: ['差旅', '报销', '财务'],
    authorId: 'user-2',
    authorName: '李娜',
    createdAt: '2026-01-08',
    updatedAt: '2026-04-20',
    version: 1,
    isOfficial: true,
    scope: 'all',
    attachments: [
      {
        id: 'att-2',
        name: '差旅费用申请表.xlsx',
        url: '/files/travel-form.xlsx',
        size: 15000,
        type: 'application/vnd.ms-excel',
        uploadedAt: '2026-01-08',
      },
    ],
    status: 'approved',
    viewCount: 756,
    favoriteCount: 42,
    commentCount: 8,
  },
  {
    id: 'entry-4',
    title: '供应商入库流程',
    content: `<h2>供应商入库管理流程</h2>

<h3>1. 流程概述</h3>
<p>本流程旨在规范供应商的筛选、评估和入库管理,确保供应链的稳定性和质量。</p>

<h3>2. 供应商筛选标准</h3>
<ul>
<li>具有独立法人资格</li>
<li>营业执照、税务登记证等证照齐全</li>
<li>产品质量符合国家标准和公司要求</li>
<li>价格具有市场竞争力</li>
<li>售后服务响应及时</li>
</ul>

<h3>3. 入库流程步骤</h3>
<ol>
<li>需求部门提出供应商引入申请</li>
<li>采购部门进行资质审核</li>
<li>样品测试和质量评估</li>
<li>价格谈判和合同签订</li>
<li>供应商信息录入系统</li>
<li>完成入库手续</li>
</ol>

<h3>4. 供应商等级评定</h3>
<table>
<tr><th>等级</th><th>评定标准</th><th>管理措施</th></tr>
<tr><td>A级</td><td>连续3年考核优秀</td><td>优先合作,账期优惠</td></tr>
<tr><td>B级</td><td>考核合格</td><td>正常合作</td></tr>
<tr><td>C级</td><td>考核不合格</td><td>限制合作,整改要求</td></tr>
</table>

<h3>5. 年度审核</h3>
<p>每年对入库供应商进行年度审核,不合格者予以清退。</p>`,
    summary: '供应商入库的标准、流程和等级评定管理',
    categoryId: 'cat-7',
    departmentId: 'dept-6',
    tags: ['采购', '供应商', '流程'],
    authorId: 'user-3',
    authorName: '王强',
    createdAt: '2026-02-14',
    updatedAt: '2026-05-28',
    version: 2,
    isOfficial: true,
    scope: 'all',
    attachments: [],
    status: 'approved',
    viewCount: 543,
    favoriteCount: 31,
    commentCount: 6,
  },
  {
    id: 'entry-5',
    title: '项目A实施经验总结',
    content: `<h2>项目A实施经验总结</h2>

<h3>项目概述</h3>
<p>项目A是我们公司2025年最大的企业数字化转型项目,历时8个月顺利完成。</p>

<h3>成功经验</h3>

<h4>1. 充分的需求调研</h4>
<p>项目组在启动阶段花费2周时间进行全面的需求调研,覆盖了所有相关部门和关键用户,确保需求理解的准确性。</p>

<h4>2. 敏捷开发方法</h4>
<p>采用Scrum敏捷开发模式,每两周一个迭代,及时收集反馈并调整开发方向,大大降低了返工风险。</p>

<h4>3. 充分的测试</h4>
<p>安排了3轮UAT测试,邀请业务部门关键用户全程参与,发现并修复了大量实际问题。</p>

<h4>4. 完善的培训</h4>
<p>上线前对所有用户进行了分批培训,制作了详细的使用手册和视频教程。</p>

<h3>教训反思</h3>

<h4>1. 进度预估偏乐观</h4>
<p>初期对某些技术难点预估不足,导致部分功能延期。建议在规划阶段预留足够的缓冲时间。</p>

<h4>2. 变更管理不够严格</h4>
<p>项目中期需求变更频繁,影响了整体进度。以后应严格执行变更控制流程。</p>

<h3>关键指标</h3>
<ul>
<li>用户满意度: 92%</li>
<li>按时交付率: 85%</li>
<li>上线后缺陷率: 0.3%</li>
<li>培训覆盖率: 100%</li>
</ul>`,
    summary: '2025年企业数字化转型项目的实施经验和教训总结',
    categoryId: 'cat-9',
    departmentId: 'dept-1',
    tags: ['项目', '经验', '总结'],
    authorId: 'user-3',
    authorName: '王强',
    createdAt: '2026-03-01',
    updatedAt: '2026-06-05',
    version: 1,
    isOfficial: false,
    scope: 'all',
    attachments: [
      {
        id: 'att-3',
        name: '项目A总结报告.pdf',
        url: '/files/project-a-report.pdf',
        size: 1250000,
        type: 'application/pdf',
        uploadedAt: '2026-03-01',
      },
    ],
    status: 'approved',
    viewCount: 423,
    favoriteCount: 67,
    commentCount: 12,
  },
  {
    id: 'entry-6',
    title: '办公用品采购流程',
    content: `<h2>办公用品采购管理制度</h2>

<h3>一、采购范围</h3>
<p>本制度适用于办公文具、纸张、打印耗材、电脑配件等办公用品的采购。</p>

<h3>二、采购流程</h3>

<h4>1. 常规采购</h4>
<ol>
<li>需求部门提交采购申请</li>
<li>部门经理审批</li>
<li>行政部统一采购</li>
<li>物资入库登记</li>
<li>领用人签字领取</li>
</ol>

<h4>2. 紧急采购</h4>
<p>对于急需的办公用品,可先采购后补办手续,但需在3个工作日内完成审批。</p>

<h3>三、库存管理</h3>
<ul>
<li>行政部设专人管理办公用品仓库</li>
<li>每月盘点一次库存</li>
<li>建立最低库存预警机制</li>
</ul>

<h3>四、领用标准</h3>
<table>
<tr><th>物品</th><th>领用周期</th><th>备注</th></tr>
<tr><td>打印纸(A4)</td><td>每月2包/人</td><td>按需领取</td></tr>
<tr><td>中性笔</td><td>每季度2支/人</td><td>以旧换新</td></tr>
<tr><td>文件夹</td><td>每年5个/人</td><td>按需领取</td></tr>
</table>`,
    summary: '办公用品采购、库存管理和领用的标准流程',
    categoryId: 'cat-4',
    departmentId: 'dept-6',
    tags: ['采购', '办公', '行政'],
    authorId: 'user-2',
    authorName: '李娜',
    createdAt: '2026-01-25',
    updatedAt: '2026-04-10',
    version: 1,
    isOfficial: true,
    scope: 'all',
    attachments: [],
    status: 'approved',
    viewCount: 312,
    favoriteCount: 18,
    commentCount: 4,
  },
  {
    id: 'entry-7',
    title: '技术架构设计规范',
    content: `<h2>技术架构设计规范</h2>

<h3>1. 设计原则</h3>

<h4>1.1 高内聚低耦合</h4>
<p>模块之间应该高内聚(内部联系紧密),低耦合(模块之间依赖少)。</p>

<h4>1.2 面向服务架构(SOA)</h4>
<p>采用微服务架构,将业务功能拆分为独立的服务,便于扩展和维护。</p>

<h4>1.3 前后端分离</h4>
<p>前端和后端完全分离,通过API进行数据交互,提高开发效率和灵活性。</p>

<h3>2. 技术选型标准</h3>

<h4>后端技术</h4>
<ul>
<li>主要语言: Java (Spring Boot), Python (Django)</li>
<li>数据库: MySQL, PostgreSQL</li>
<li>缓存: Redis</li>
<li>消息队列: RabbitMQ</li>
</ul>

<h4>前端技术</h4>
<ul>
<li>框架: React, Vue</li>
<li>构建工具: Vite, Webpack</li>
<li>样式: TailwindCSS, Styled Components</li>
</ul>

<h3>3. 代码规范</h3>
<ul>
<li>遵循PEP8(Python)和Google Java Style Guide</li>
<li>使用ESLint和Prettier统一代码风格</li>
<li>所有代码必须通过单元测试</li>
<li>核心模块需编写技术文档</li>
</ul>

<h3>4. 安全性要求</h3>
<ul>
<li>敏感数据必须加密存储</li>
<li>API接口需认证授权</li>
<li>防止SQL注入、XSS等常见攻击</li>
<li>定期进行安全审计</li>
</ul>`,
    summary: '技术架构设计的原则、标准和安全要求',
    categoryId: 'cat-11',
    departmentId: 'dept-1',
    tags: ['技术', '架构', '规范'],
    authorId: 'user-3',
    authorName: '王强',
    createdAt: '2026-02-20',
    updatedAt: '2026-05-30',
    version: 2,
    isOfficial: true,
    scope: 'all',
    attachments: [],
    status: 'approved',
    viewCount: 678,
    favoriteCount: 54,
    commentCount: 19,
  },
  {
    id: 'entry-8',
    title: '会议室预约管理制度',
    content: `<h2>会议室预约管理制度</h2>

<h3>一、预约规则</h3>
<ul>
<li>公司会议室采用线上预约制度</li>
<li>提前预约时间: 会议前1小时至7天</li>
<li>每个部门每周预约上限: 10次</li>
<li>单个会议时长上限: 4小时</li>
</ul>

<h3>二、会议室类型</h3>
<table>
<tr><th>会议室</th><th>容量</th><th>设备</th><th>预约优先级</th></tr>
<tr><td>A会议室</td><td>30人</td><td>投影、音响、视频会议</td><td>公司级会议</td></tr>
<tr><td>B会议室</td><td>15人</td><td>投影、白板</td><td>部门会议</td></tr>
<tr><td>C会议室</td><td>8人</td><td>电视、白板</td><td>小组会议</td></tr>
</table>

<h3>三、使用规范</h3>
<ol>
<li>预约后如无法使用,请提前1小时取消</li>
<li>会议期间请保持安静,勿大声喧哗</li>
<li>使用完毕后请整理干净,恢复原状</li>
<li>爱护会议室设备,损坏需照价赔偿</li>
<li>严禁在会议室用餐、吸烟</li>
</ol>

<h3>四、违约处理</h3>
<ul>
<li>连续3次预约未使用: 暂停预约权限1周</li>
<li>损坏公物: 照价赔偿并全公司通报</li>
<li>严重违规: 取消会议室使用资格</li>
</ul>`,
    summary: '会议室预约、使用和管理的相关规定',
    categoryId: 'cat-4',
    departmentId: 'dept-6',
    tags: ['会议', '预约', '行政'],
    authorId: 'user-2',
    authorName: '李娜',
    createdAt: '2026-01-18',
    updatedAt: '2026-03-25',
    version: 1,
    isOfficial: true,
    scope: 'all',
    attachments: [],
    status: 'approved',
    viewCount: 456,
    favoriteCount: 29,
    commentCount: 7,
  },
];

export const getEntryById = (id: string): Entry | undefined => {
  return mockEntries.find(entry => entry.id === id);
};

export const getEntriesByCategoryId = (categoryId: string): Entry[] => {
  return mockEntries.filter(entry => entry.categoryId === categoryId);
};

export const getEntriesByDepartmentId = (departmentId: string): Entry[] => {
  return mockEntries.filter(entry => entry.departmentId === departmentId);
};

export const getHotEntries = (limit: number = 6): Entry[] => {
  return [...mockEntries]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
};

export const getRecentEntries = (limit: number = 6): Entry[] => {
  return [...mockEntries]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

export const searchEntries = (keyword: string): Entry[] => {
  const lowerKeyword = keyword.toLowerCase();
  return mockEntries.filter(entry =>
    entry.title.toLowerCase().includes(lowerKeyword) ||
    entry.summary.toLowerCase().includes(lowerKeyword) ||
    entry.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
};
