module Jekyll
  class Post
    def render_nil(layouts, site_payload)
      # construct payload
      payload = {
        "page" => self.to_liquid
      }.deep_merge(site_payload)
    end
  end

  class Site
    def render
      payload = site_payload
      self.posts.each do |post|
        if post.data['layout'].nil?
          post.render_nil(self.layouts, payload)
        elsif
          post.render(self.layouts, payload)
        end
      end

      self.pages.each do |page|
        relative_permalinks_deprecation_method if page.uses_relative_permalinks
        page.render(self.layouts, payload)
      end

      self.categories.values.map { |ps| ps.sort! { |a, b| b <=> a } }
      self.tags.values.map { |ps| ps.sort! { |a, b| b <=> a } }
    rescue Errno::ENOENT => e
      # ignore missing layout dir
    end

   def write
      self.posts.each do |post|
        unless post.data['layout'].nil?
          post.write(self.dest)
        end
      end
      self.pages.each do |page|
        page.write(self.dest)
      end
      self.static_files.each do |sf|
        sf.write(self.dest)
      end
    end
  end
end