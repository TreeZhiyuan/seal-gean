import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  useEffect(() => {
    document.title = '在线印章生成器 - 免费制作印章图片';
  }, []);

  return <main className="home-page">
    <section className="seo-intro" aria-labelledby="home-title">
      <h1 id="home-title">在线印章生成器</h1>
      <p>免费在线制作公司印章、个人印章和圆形印章图片，支持自定义文案、颜色、字体、尺寸和透明背景。</p>
      <Link className="content-link" to="/generator">开始制作印章</Link>
    </section>

    <section className="seo-content" aria-label="印章生成器介绍">
      <section>
        <h2>支持的印章类型</h2>
        <p>你可以使用本工具制作公司公章样式、个人印章样式，以及适合设计稿和演示场景的圆形、方形或椭圆形印章图片。</p>
      </section>
      <section>
        <h2>如何制作印章图片</h2>
        <ol>
          <li>进入印章生成器，选择印章类型和形状。</li>
          <li>填写印章文案，调整颜色、字体大小、边线和其他参数。</li>
          <li>确认预览效果后，点击“下载印章”保存 PNG 图片。</li>
        </ol>
      </section>
      <section>
        <h2>功能特点</h2>
        <ul>
          <li>无需安装软件，打开浏览器即可使用。</li>
          <li>支持自定义主文字、副文字、中心文字和序列号。</li>
          <li>支持透明背景，方便将印章图片用于设计稿。</li>
          <li>配置和生成过程在浏览器本地完成。</li>
        </ul>
      </section>
      <section>
        <h2>使用说明</h2>
        <p>本工具生成的图片仅用于设计、演示和非正式用途，不能替代依法备案或实际使用的正式印章。关于项目实现方式和隐私说明，请查看<Link to="/about">关于本工具</Link>。</p>
      </section>
    </section>
  </main>;
}
