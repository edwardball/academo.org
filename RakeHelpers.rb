class RakeHelpers
	#desc "Checks state of local file system"
	def self.isclean
		clean = `git status --porcelain`

		if clean.length > 0
			return false
		else
			return true
		end
	end

	#desc "Checks if current state is on master"
	def self.ismaster
		branch = `git symbolic-ref --short HEAD`
		if branch.strip == "master"
			return true
		else
			return false
		end
	end

end