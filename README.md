# Restored HealthCare.gov repository from 1 Oct 2013.

This repository originally lived at [github.com/CMSgov/healthcare.gov](https://github.com/CMSgov/healthcare.gov), but apparently disappeared from there sometime on 12 Oct 2013.  There is [reason to believe](http://www.wired.com/wiredenterprise/2013/10/obamacare-github/) that the repository's owners pulled it down mainly because they didn't want to handle misdirected bug reports being filed against it -- bug reports that were really about the back-end systems that this code merely interfaced with but had no control over.

(There was also a problem with the original repository's commit history.  The repository as originally posted -- i.e., what this is a clone of -- contained only one commit, a "top-skim" style import of the code, and was thus missing the true commit history.  An issue [had been opened](https://www.google.com/search?q=%22benbalter%22+healthcare.gov+%22contributor+information%22+%22commit+history%22) against it, asking for the problem to be fixed, but the repository was taken down before that had a chance to be addressed.)

A possibly better course would have been for them to [rename](https://help.github.com/articles/renaming-a-repository) the repository to "healthcare.gov-web-front-end" or something like that, and update the README.md file to prominently state which kinds of bug reports would be appropriate to file there and which wouldn't.  I hope that after the brouhaha dies down, the repository is restored, with properly historicized commit history.

In the meantime, the repository's disappearance was widely noticed.  Lauren C. Still saw a [tweet](https://twitter.com/kfogel/status/389134395694526464) of mine asking about it, and [replied](https://twitter.com/laurencstill/status/389181641689534464) that there was a git bundle at [archive.org/details/healthcare-gov-gitrepo](https://archive.org/details/healthcare-gov-gitrepo) preserving this repository as of 1 Oct 2013.  That's what's imported here.  The contents of the original README.md follow.

-Karl Fogel (@kfogel)

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