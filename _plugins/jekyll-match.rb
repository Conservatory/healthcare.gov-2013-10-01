module Jekyll
  class Match < Generator
    priority :normal

    def generate(site)
      config = site.config
      posts = site.posts
      if config['languages']
        match = {}
        config['languages'].each do |lang|
          match[lang['value']] = Hash[posts.reject{|post| lang['value'] != post.data['lang']}.map{|post| [post.id.split('/').last, post]}]
        end
      else
        match = Hash[posts.map{|post| [post.id, post]}]
      end
      config['match'] = match
    end
  end
end
