module Jekyll

  class RenderPartialTag < Liquid::Tag
    # include OctopressFilters

    def look_up(context, name)
      lookup = context

      name.split(".").each do |value|
        lookup = lookup[value]
      end

      lookup
    end

    def initialize(tag_name, markup, tokens)
      @file = nil
      @raw = false
      if markup =~ /^(\S+)\s?(\w+)?/
        @file = $1.strip
        @raw = $2 == 'raw'
      end
      super
    end

    def render(context)
      file_dir = (context.registers[:site].source || 'source')
      file_path = Pathname.new(file_dir).expand_path
      file = file_path + look_up(context,@file)

      unless file.file?
        # return "File #{file} could not be found"
        return ""
      end

      Dir.chdir(file_path) do
        contents = file.read
        if contents =~ /\A-{3}.+[^\A]-{3}\n(.+)/m
          contents = $1.lstrip
        end
        # contents = pre_filter(contents)
        if @raw
          contents#.gsub(/"/, "&quot;")#.gsub(/\n/, "\\n")
        else
          partial = Liquid::Template.parse(contents)
          context.stack do
            partial.render(context)
          end
        end
      end
    end
  end
end

Liquid::Template.register_tag('render', Jekyll::RenderPartialTag)