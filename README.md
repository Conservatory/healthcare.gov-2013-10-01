# Restored HealthCare.gov repository from 1 Oct 2013.

This repository originally lived at [github.com/CMSgov/healthcare.gov](https://github.com/CMSgov/healthcare.gov), but apparently disappeared from there sometime on 12 Oct 2013.  I believe its owners pulled it down only temporarily, while they fix the commit history -- the repository as originally posted (i.e., what this is a clone of) contained only one commit, a "top-skim" style import of the code, and was thus missing the true commit history.  An issue (number #12) had been opened against it, asking for the problem to be fixed.

So my best guess is that the repository was pulled down while they restore the history, and if so, we can expect a properly historicized version to appear soon at the original location.  (It probably would have been better for them to [rename](https://help.github.com/articles/renaming-a-repository) the repository and respond in the issue to explain the plan, though.)

In the meantime, the repository's disappearance was widely noticed.  Alexander Howard saw a [tweet](https://twitter.com/kfogel/status/389134395694526464) of mine asking about it, and [replied](https://twitter.com/digiphile/status/389198586099277824) that there was a git bundle at [archive.org/details/healthcare-gov-gitrepo](https://archive.org/details/healthcare-gov-gitrepo) preserving this repository as of 1 Oct 2013.  That's what's imported here.  The contents of the original README.md follow.

-Karl Fogel (@kfogel), 12 Oct 2013

--------------------------------------------------------------------------
# HealthCare.gov-Open-Source-Release

This project includes the source code and content for the healthcare.gov website. For more information, please visit https://www.healthcare.gov/developers

## Local Installation Requirements

- Linux, Unix, Windows or Mac OS X
- [Ruby](http://www.ruby-lang.org/en/downloads/)
- [RubyGems](http://rubygems.org/pages/download)
- [Jekyll](http://jekyllrb.com)


## Ruby

### To install ruby on unix:

`yum install ruby` (or `sudo apt-get install ruby1.9.1`)


### To install ruby on Mac OS X:

`curl -L https://get.rvm.io | bash -s stable --ruby`

Visit the following links for more detailed information on how to set up Ruby using a method applicable to your environment:

Three Ways of Installing Ruby (Linux/Unix)
http://www.ruby-lang.org/en/downloads/
 
RubyInstaller for Windows
http://rubyinstaller.org/

How to Install Ruby on a Mac
http://net.tutsplus.com/tutorials/ruby/how-to-install-ruby-on-a-mac/


## Install rubygems: 

- `cd ~/`
- `wget http://production.cf.rubygems.org/rubygems/rubygems-1.8.24.tgz`
- `tar xzvf rubygems-1.8.24.tgz`
- `cd rubygems-1.8.24`
- `ruby setup.rb`


## Managing Dependencies Using Bundler

We recommend using Bundler to manage dependencies. Once you have Ruby installed, install Bundler by running the following command: 'gem install bundler'

Once Bundler is installed, you install/update depencies by simply running 'bundle install' within your project folder.

More information on Bundler may be found here: http://gembundler.com/


## Install Jekyll

- `cd healthcare.gov` (or the location of your cloned repository)
- `bundle install`

For more information and detailed documentation on Jekyll, visit the following sites:

Jekyll Project Home
http://jekyllrb.com

Jekyll on GitHub
https://github.com/mojombo/jekyll


## Clone the repository

- `cd /var/www/html` (or the location you would like the compiled site to live)
- `git clone https://github.com/CMSgov/HealthCare.gov-Open-Source-Release.git healthcare.gov`


## Generate the site and serve

- `jekyll serve`
- Browse to [localhost:4000](http://localhost:4000) to view the site