require 'json'

# Generate JSON represenations of all posts

module Jekyll

  class JSONIndex < Page
    def initialize(site, base, dir, name, post)
      @site = site
      @base = base
      @dir = dir
      @name = name

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'page.json')
      self.data['data'] = post
    end
  end

  class JSONIndexGenerator < Generator
    safe true
    priority :lowest
    
    def generate(site)
    
      site.posts.each do |post|
        jsonPost = post.id.split('/')[1] == 'help' ? render_help_json(site,post) : render_json(site,post)
        
        if post.url == '/' or post.url == '/es'
          filename = 'index.json'
          dir = post.url
        else
          filename = post.url + '.json'
          filename.sub!(/^\//, '')
          dir = '/'
        end

        site.pages << JSONIndex.new(site, site.source, dir, filename, jsonPost)
      end
    end
    
    def render_json(site, post)
      post.render( {}, site.site_payload)
      output = post.to_liquid
      hash = JSON.parse(output.to_json)
      hash.delete('next')
      hash.delete('previous')
      return hash.to_json
    end

    def render_help_json(site, post)
      post.render( {}, site.site_payload)
      output = post.to_liquid
      hash = {
        "id"    => output['id'].split('/')[2],
        "title" => output['title'],
        "lang"  => output['lang'] || 'en',
        "bite"  => output['bite'] || '',
        "snack" => output['snack'] || '',
        "meal"  => output['content']
      }
      return hash.to_json
    end
  end

end

# Filter to output JSON data

module JsonFilter
  def json(hash)
    hash.delete('next')
    hash.delete('previous')
    hash.to_json
  end

  Liquid::Template.register_filter self
end
