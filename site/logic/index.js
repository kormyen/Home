function Index()
{
	const parent = this;

	this.media = null;
	this.pages = null;
	this.log = null;
	this.inline = null;
	this.runelike = null;

	this.projects = null;
	this.articles = null;

	this.focus = null;
	this.photos = null;
	this.posts = null;
	// this.thoughts = null;
	// this.notes = null;
	// this.blogs = null;

	this.nav = null;
	this.footer = null;
	
	this.main = null;
	this.header = null;

	this.install = function()
	{
		this.media = new Media();
		this.media.install();
		this.links = new Links();
		this.links.install();

		this.log = new Log();
		this.inline = new Inline();
	    this.projects = new Projects();
	    this.articles = new Articles();
		this.runelike = new Runelike();
	    this.pages = new Pages();

		this.log.install(SHELL, this.inline);
		this.inline.install(this.media, this.links, this.log, this.projects);
		this.runelike.install(this.media, this.inline);
	    this.projects.install(PROJECTS, this.media, this.log, this.runelike, this.inline);
	    this.articles.install(ARTICLES, this.media, this.runelike, this.inline);
		this.pages.install(PAGES, this.runelike, this.inline);

		this.main = document.querySelector('main');
		this.header = new Header();
		this.header.install(document.querySelector('header'));
	    
	    this.focus = new Focus();
		this.focus.install(this.log, this.projects);
		this.photos = new Photos();
		this.photos.install(this.media);
		this.posts = new Posts();
		this.posts.install(this.articles);
		// this.thoughts = new Thoughts();
		// this.thoughts.install(this.articles);
		// this.notes = new Notes();
		// this.notes.install(this.articles);
		// this.blogs = new Blogs();
		// this.blogs.install(this.articles);

		this.nav = new Nav();
		this.nav.install(this.inline);

		this.footer = new Footer();
		this.footer.install(this.inline);
	}

	this.start = function()
	{
		document.querySelector('#footerContent').innerHTML = this.footer.getContent();
		this.load();
	}

	this.load = function()
	{
		let hash = window.location.hash;
		let target = hash ? hash.substr(1, hash.length - 1) : '';

		if(target == '')
		{
			console.log('load')
			// OVERVIEW
			this.focus.start();
			this.photos.start();
			this.posts.start();
			// this.thoughts.start();
			// this.notes.start();
			// this.blogs.start();

			let data = this.pages.get('index');
			this.header.setImage(this.media.getByDate(data.HEAD));

			// LENSES
			this.main.innerHTML = 
				`<section class="alignLeft">
					<p class="fontSizeLarge marginTopLarge colorSecondary"><a class='subtleLink' href="${this.inline.getInternalUrl('page', 'hamish')}">Hamish MacDonald</a> is an Experience Designer</p>
				</section>

				<section class="marginTopLarge">
					<div class="marginBottomNormal fontSizeNormal">
						<span class="colorSecondary">Recent <a class='subtleLink' href="${this.inline.getInternalUrl('page', 'projects')}">projects</a> of ${this.projects.getCount()}</span>
					</div>
					<div class="flexboxRow flexboxWrapToggle trippleArticleContainer" id="focusContainer"></div>
				</section>

				<section class="marginTopLarge">
					<div class="marginBottomNormal fontSizeNormal">
						<span class="colorSecondary">Recent <a class='subtleLink' href="${this.inline.getInternalUrl('page', 'photos')}">photos</a> of ${this.photos.getCount()}</span>
					</div>
					<div class="flexboxRow flexboxWrapToggle trippleArticleContainer" id="photoContainer">
					</div>
				</section>
				
				<section class="marginTopLarge">
					<div class="marginBottomNormal fontSizeNormal">
						<span class="colorSecondary">Recent <a class='subtleLink' href="${this.inline.getInternalUrl('page', 'posts')}">posts</a> of ${this.posts.getCount()}</span>
					</div>
					<div class="flexboxRow flexboxWrapToggle trippleArticleContainer" id="thoughtContainer">
					</div>
				</section>`;
				
			this.focus.display(document.querySelector('#focusContainer'));
			this.photos.display(document.querySelector('#photoContainer'));
			this.posts.display(document.querySelector('#thoughtContainer'));
		}
		else if (target == 'photos')
		{
			let data = this.pages.get(target);
			this.header.setImage(this.media.getByDate(data.HEAD));

			let htmlContent = ``;

			let navData = [];
			navData.oneName = `Photos`;
			htmlContent += this.nav.create(navData);

			htmlContent += `<div class='projectList'>`;
			let list = this.media.filterPhotos(this.media.db);
			for (let k = 0; k < list.length; k++)
			{
				let element = list[[k]];
				htmlContent += element.htmlColor(0);
			}
			htmlContent += '</div>'; // end projectList

			this.main.innerHTML = htmlContent;
		}
		else if (target == 'projects')
		{
			let data = this.pages.get(target);
			this.header.setImage(this.media.getByDate(data.HEAD));
			
			let htmlContent = ``;

			let navData = [];
			navData.oneName = `Projects`;
			htmlContent += this.nav.create(navData);

			htmlContent += `<div class='projectList'>`;
			let list = this.projects.getAll();
			const keys = Object.keys(list);
			for (let k = 0; k < keys.length; k++)
			{
				let element = list[keys[k]];
				htmlContent += element.HtmlArticle();
			}
			htmlContent += '</div>'; // end projectList

			this.main.innerHTML = htmlContent;
		}
		else if (target == 'posts')
		{
			let data = this.pages.get(target);
			this.header.setImage(this.media.getByDate(data.HEAD));
			
			htmlContent = ``;

			let navData = [];
			navData.oneName = `Posts`;
			htmlContent += this.nav.create(navData);

			htmlContent += `<div class='projectList'>`;
			let list = this.articles.getAll();
			for (let k = 0; k < list.length; k++)
			{
				htmlContent += list[k].HtmlArticle(`post`);
			}

			this.main.innerHTML = htmlContent;
		}
		////////////////////////////////////////////////////////////////////////////////
		// ARTICLE PAGES ///////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////
		else if (target == 'hamish' || target == 'log')
		{
			let data = this.pages.get(target);
			this.header.setImage(this.media.getByDate(data.HEAD));
			let htmlContent = ``;

			let navData = [];
			navData.oneName = parent.capitalizeFirstLetter(target);
			htmlContent += this.nav.create(navData);

			// Article
			htmlContent += this.pages.buildArticle(data.HtmlSidebar, data.HtmlBody);

			this.main.innerHTML = htmlContent;
		}
		else if (target.substr(0, 7) == 'project')
		{
			target = target.substr(8);
			let data = this.projects.get(target);
			this.header.setImage(data.media[0]);
			let htmlContent = ``;

			// Sidebar
			let navData = [];
			navData.oneName = `Projects`;
			navData.oneLink = this.inline.getInternalUrl('page', 'projects');
			navData.twoName = parent.capitalizeFirstLetter(target);
			htmlContent += this.nav.create(navData);

			// Article
			htmlContent += this.pages.buildArticle(data.HtmlSidebar, data.HtmlBody);

			this.main.innerHTML = htmlContent;
		}
		else if (target.substr(0, 4) == 'post')
		{
			target = target.substr(5);
			target = target.replace(/-/g,` `);
			let data = this.articles.get(target);
			this.header.setImage(data.media);
			let htmlContent = ``;

			// Sidebar
			let navData = [];
			navData.oneName = `Posts`;
			navData.oneLink = this.inline.getInternalUrl('page', 'posts');
			navData.twoName = data.NAME;
			htmlContent += this.nav.create(navData);
			
			// Article
			htmlContent += this.pages.buildArticle(data.HtmlSidebar, data.HtmlBody);

			this.main.innerHTML = htmlContent;
		}
		else
		{
			console.log('Unhandled url');
		}
	}

	this.capitalizeFirstLetter = function(string) 
	{
		string = string.toLowerCase();
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}