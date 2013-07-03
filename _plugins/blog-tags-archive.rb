module Jekyll
  class TagIndex < Page
    def initialize(site, base, dir, tag, title, lang)
      @site = site
      @base = base
      @dir = '/'
      @url = dir + '/'
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'blog-index.html')
      self.data['tag'] = tag
      self.data['title'] = title
      self.data['lang'] = lang
    end
  end
  class TagGenerator < Generator
    priority :low

    def generate(site)
      site.tags['topic'].each do |tag|
        if tag.categories.include? 'es'
          lang = 'es'
          dir = '/es/blog'
        else
          lang = 'en'
          dir = '/blog'
        end
        title = tag.data['title']
        topic = tag.url.dup
        topic.sub!(/\bes\b/, '')
        topic.gsub!(/\//, '')
        write_tag_index(site, File.join(dir, topic), topic, title, lang)
      end
    end
    def write_tag_index(site, dir, tag, title, lang)
      index = TagIndex.new(site, site.source, dir, tag, title, lang)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end