module FindInArray
  
  def findByIndex(input, index)
    if input.nil? then return end
    newArray = input.to_s.split
    newArray[index]
  end

  Liquid::Template.register_filter self
end