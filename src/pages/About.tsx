import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function About() {
  useEffect(() => {
    document.title = '关于在线印章生成器';
  }, []);

  return <main className="about-page">
    <article className="about-content">
      <h1>关于在线印章生成器</h1>
      <p className="about-lead">这是一个在浏览器中制作和下载印章图片的轻量工具，适合设计稿、演示文档和其他非正式场景。</p>

      <section>
        <h2>网站用途</h2>
        <p>在线印章生成器提供可视化配置面板，让你快速调整印章类型、形状、文案、颜色、字体、边线和背景，并实时查看生成效果。</p>
      </section>

      <section>
        <h2>主要功能</h2>
        <ul>
          <li>支持公司公章和个人印章样式。</li>
          <li>支持圆形、方形和椭圆形印章。</li>
          <li>支持主文字、副文字、中心文字和序列号设置。</li>
          <li>支持颜色、字体大小、字体粗细、边线和透明背景调整。</li>
          <li>支持将生成结果下载为 PNG 图片。</li>
        </ul>
      </section>

      <section>
        <h2>隐私和数据处理</h2>
        <p>印章配置和图片生成在你的浏览器本地完成，当前版本不会将填写的文案或生成结果上传到服务器。</p>
      </section>

      <section>
        <h2>技术实现</h2>
        <p>项目基于 React、TypeScript、Vite 和 Canvas 实现，印章绘制能力来自 <a href="https://github.com/TreeZhiyuan/seal" target="_blank" rel="noreferrer">seal 核心算法项目</a>。你可以在 <a href="https://github.com/TreeZhiyuan/seal-gean" target="_blank" rel="noreferrer">GitHub 源码仓库</a>中查看项目实现。</p>
      </section>

      <section>
        <h2>使用范围</h2>
        <p>本工具生成的图片仅用于设计、演示和非正式用途，不能替代依法备案或实际使用的正式印章。涉及法律效力、合同签署或企业用章时，请按照相关规定办理。</p>
      </section>

      <Link className="content-link" to="/generator">开始制作印章</Link>
    </article>
  </main>;
}
