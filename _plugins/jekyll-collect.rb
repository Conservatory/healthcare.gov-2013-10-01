module Jekyll

  class CustomCollection < Jekyll::Generator
    safe true
    priority :normal

    def initialize(config)
    end

    def generate(site)
      config = site.config

      if !config['jekyll_collect']
        return
      else
        config['jekyll_collect'].each do |field|
          collection = Hash.new
          
          site.posts.each { |post|
            if post.data[field]
              post.data[field].each { |val|
                if !collection[val]
                  collection[val] = []
                end
                collection[val].push(post)
              }
            end
          }
          collection.values.map { |sortme| sortme.sort! { |a, b| b <=> a } }
          config[field] = collection
        end
      end
    end
  end
end