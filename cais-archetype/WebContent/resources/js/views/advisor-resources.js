/*
Advisor resources view, reuses much of original code from MW
Manages presentation of advisor resources and documents 
TODO:
	move server stuff over to BB models
	move router constructor out of view init
*/

$(document).ready(function() {

var AdvisorResourcesView = Backbone.View.extend({
	el: $('.workspace'), // rendered in advisorResources.jsp
	initialize: function() {
		var that = this;
		Server.getAdvisorResources( {}, function(response) {
			that.resourceCategories = response;
			that.render();
		});
	},
	render: function() {
		var resourceCategories = this.resourceCategories,
			that = this;
		Server.caisUser.getLocalSessionInfo(function(user) {
			for (var i in resourceCategories) {
				var newSection = $("<li/>");
				var newSectionLink = $("<a/>");
				var newSectionSubcategories = $("<ul/>");
				var hasSubcategories = false;
				newSectionLink.attr("href", "#" + resourceCategories[i].link).attr('data-bypass', true);
				newSectionLink.append(resourceCategories[i].category).appendTo(newSection);
				var totalCounter = 0,
					special = false;
				for (var j in resourceCategories[i].subcategories) {
					if(resourceCategories[i].subcategories[j].count > 0
							|| user.caisemployee
							|| resourceCategories[i].subcategories[j].link === 'Alternative_Investments_Glossary') {
						hasSubcategories = true;
						var newSubCategory = $("<li/>"),
							counter = "",
							totalArticles = resourceCategories[i].subcategories[j].count ? parseInt(resourceCategories[i].subcategories[j].count) : 0;
						if( resourceCategories[i].subcategories[j].link !== 'Alternative_Investments_Glossary'){
							counter = "<span> ("+totalArticles+")</span>";
							totalCounter+=totalArticles;
						}else{
							special = true;
						}

						newSubCategory.append("<a data-bypass href='#" + resourceCategories[i].link + '/' + resourceCategories[i].subcategories[j].link + "' data-categoryId='" + resourceCategories[i].subcategories[j].categoryId + "'>" + resourceCategories[i].subcategories[j].category+counter+ "</a");
						newSubCategory.appendTo(newSectionSubcategories);
					}
				}
				if(totalCounter>0 || special || user.caisemployee){
					if(hasSubcategories) {
						newSection.append(newSectionSubcategories);
					} else {
						newSectionLink.attr("data-categoryId", resourceCategories[i].categoryId);
					}
					this.$('.resource-section-list').append(newSection);
				}
			}
			that.router = new AdvisorRouter();
			$(document).on('click', 'a[data-bypass]', function (e) {
				var href = $(this).attr('href');
				var protocol = this.protocol + '//';
				
				if (href.slice(protocol.length) !== protocol) {
					e.preventDefault();
					that.router.navigate(href, {trigger: true});
				}
			});
			Backbone.history.start({pushState: true, root: 'advisorResources'});
		});
		
	},
	events: {
		'click .show-uploader': 'showUploaderClickHandler',
		'click .delete-article': 'deleteArticleClickHandler',
		'click .fyi-article':'addToFYIClickHandler'
	},
	getCategory: function(cat) {
		var category = null;
		for (var i in this.resourceCategories) {
			if (this.resourceCategories[i].link == cat) {
				category = this.resourceCategories[i];
				break;
			}
		}
		return category;
	},
	showMainCategory: function(cat, hideContent) {
		var category = this.getCategory(cat);

		// we clicked on a main category
		this.$("li.root").empty().append("<a href='#" + category.link + "'>" + category.category + "</a>");
		this.$("li.category").empty();
		this.$(".category-splitter").hide();
		this.$(".article-splitter").hide();
		this.$("li.selected").removeClass("selected");
		var $container = this.$("a[href=" + '#' + cat + "]").parents("li");
		$container.addClass("selected");
		if (category.hasOwnProperty("subcategories")) {
			this.$(".article-list").empty();
			this.$(".article-content").empty();
			var subCats = ["<ul>"];
			for(var i=0; i<category.subcategories.length; i++){
				var item = category.subcategories[i];
				subCats.push("<li><a class='cais-link' href='"+category.link+"/"+item.link+"'>"+item.category+"</a></li>");
			}
			subCats.push("</ul>");
			if (!hideContent) this.$(".header").text(category.category);
			if (!hideContent){
				this.$(".article-content").text(category.summary);
				this.$(".article-content").append(subCats.join(""));
			}
			$container.find("ul li").first().addClass("selected");
			return;
		} else {
			this.$(".article-list").empty();
			this.$(".article-content").empty();
			if (!hideContent) this.$(".header").text(category.category);
			
			var articleTemplate = kendo.template($("#article-template").html());
			var articleItem = $("<div class='article'/>");
			articleItem.html(articleTemplate({
				title: "Content Coming Soon...",
				summary: "",
				link: "",
				author: ""
			}));
			
			if (!hideContent) this.$(".article-list").append(articleItem);
			this.$(".article-list .sub-title").remove();
			//populateCategoryPage(category);
		}
	},
	showSubCategory: function(cat, subcat) {
		this.showMainCategory(cat, true);
		var $container = this.$("a[href=#" + cat + "]").parents("li"),
			$list = $container.find("ul li");
		$list.removeClass("selected");
		$list.find("a[href='#"+cat+"/"+subcat+"']").parents("li").addClass("selected");
		// if it's the glossary, load the glossary
		if (subcat === 'Alternative_Investments_Glossary') {
			this.loadAiGlossary();
			return;
		}
		this.populateArticleList(this.getCategory(cat), subcat);
	},
	showArticle: function(cat, subcat, articleId) {
		this.showSubCategory(cat, subcat);
		var paramString= "docId="+ articleId;
		window.open('api/document/download?'+ paramString);
	},
	populateArticleList: function(category, subcat) {
		var that = this;
		//this.$(".header").text(category.category);
		var subcategory;
		for (var i in category.subcategories) {
			if (category.subcategories[i].link == subcat) {
				subcategory = category.subcategories[i];
				this.$("li.root").empty().append("<a data-bypass href='#" + category.link + "'>" + category.category + "</a>");
				this.$("li.category").empty().append("<a data-bypass href='#" + subcategory.link + "'>" + subcategory.category+"("+category.count+")" + "</a>");
				this.$("li.article").empty();
				this.$(".category-splitter").show();
				this.$(".article-splitter").hide();
				break;
			}
		}
		if (subcategory) {
			Server.getAdvisorResourcesArticles({ categoryId: subcategory.categoryId }, function(response) {
				that.$(".article-list").empty();
				that.$(".article-content").empty();
				that.$(".header").text(subcategory.category);
				for (var i in response) {
					var article = response[i],
						summary = (article.summary) ? article.summary : "",
						articleItem;
					if(article.articleTypeId === 8){
						articleItem = $("<div class='article video' data-src='"+article.link+"' data-title='"+article.title+"'><div class='icon'></div><div class='title'><a>"+article.title+"</a></div><div class='sub-title' style='margin-bottom:5px;'>"+summary+"</div><div class='content'></div></div>");
					}else{
						articleItem = $("<div class='article'/>");
						var articleTemplate = kendo.template($("#article-template").html());
						articleItem.html(articleTemplate({
							title: article.title,
							summary: summary,
							articleid: article.articleid,
							link: "/api/document/download?docId=" + article.documentId,
							author: article.author,
							featured: article.isFYIFeatured
						}));
					}
					that.$(".article-list").append(articleItem);
				}
				if(window.location.hash) {
					var elementToPlay = parseInt(window.location.hash.replace('#','')),
						toPlay = $(".article.video").get(elementToPlay-1);
					if(toPlay)$(toPlay).trigger('click');
				}
				// CAIS-312, needs backend support
				Server.caisUser.getLocalSessionInfo(function(user) {
					if (user.caisemployee) {
						that.$('.delete-article').show();
						that.$('.fyi-article').show();

						
						that.initArticleUploader();
					}
				});
			});
		} else {
			this.$(".article-list").empty();
			this.$(".article-content").empty();
			this.$(".header").text(category);

			for (var i in category.articles) {
				var article = category.articles[i];
				var articleTemplate = kendo.template($("#article-template").html());
				var articleItem = $("<div class='article'/>");
				var summary = (article.summary) ? article.summary : "";
				articleItem.html(articleTemplate({
					title: article.title,
					summary: summary,
					link: "#" +category.link + '/' + subcategory.link +'/' + article.documentId,
					author: article.author
				}));
			}
		}
		this.activeCategory = category;
		this.activeSubcategory = subcategory;




	},
	addToFYIClickHandler: function(event) {
		var $elem = $(event.target),
			currentId=parseInt($elem.parent().attr('data-articleId')),
			onSuccess = function() {},
			onFail = function() {
				$elem.prop('checked', !$elem.is(":checked"));
				new Alert("There was an error updating the resource.", "OK");
			};
		if(currentId){
			
			if($elem.is(":checked")){
				Server.addAdvisorDocToFYI(JSON.stringify(currentId), onSuccess, onFail);
			}else{
				Server.removeAdvisorDocFromFYI(JSON.stringify(currentId), onSuccess, onFail);
			}
		}
	},
	deleteArticleClickHandler: function(event) {
		//TODO: move articles to BB model w/ CRUD functions
		event.preventDefault();
		var elem = $(event.target);
		new Alert('Are you sure you would like to delete this article?', 'DELETE', 'CANCEL');
		$(document).one("alertConfirm", function() {
			elem.text('Deleting...');
			var onSuccess = function() {
				elem.text('Deleted!');
				elem.parents('.article').fadeOut('slow', function() {
					$(this).remove();
				});
			};
			var onFail = function() {
				new Alert("Resource could not be deleted.", "OK");
				elem.text('Delete Article');
			};
			Server.deleteAdvisorDoc(JSON.stringify(parseInt(elem.attr('data-articleId'))), onSuccess, onFail);
		});
		$(document).one("alertCancel", function() {
			$(document).unbind("alertConfirm");
		});
	},
	showUploaderClickHandler: function(event) {
		event.preventDefault();
		this.$('#upload-resources-form').slideToggle();
	},
	initArticleUploader: function() {
		this.$('.article-list').prepend(kendo.template($('#uploader-template').html()));
		var form = this.$('#upload-resources-form');
		var that = this;

		this.$("#datepicker").kendoDatePicker({
			format: "yyyy/MM/dd",
			value: new Date()
		});
		this.$('#doc-file').kendoUpload({
			showFileList: true,
			multiple: false,
			localization: {
				select: 'Select file'
			},
			async: {
				saveUrl: '/addAdvisorDoc',
				removeUrl: "remove",
				autoUpload: false
			},
			select: function(e) {
				form.parsley('validate');
				$.each(e.files, function(i, file) {
					if (!file.extension.match('^.*\.(pdf|PDF)$')) {
						e.preventDefault();
						Alert('The file must be a PDF document.', 'OK');
					}
				});
			},
			upload: function (e) {
				if (form.parsley('validate')) {
					var data = {
						file_name: form.find('[name=file_name]').val(),
						category_id: that.activeSubcategory.categoryId,
						documentCategoryId: 14,
						date: form.find("#datepicker").val(),
						author: form.find('[name=author]').val(),
						is_fyi_featured: form.find('[name=fyi]').val(),
					};
					e.data = data;
				}
				else {
					e.preventDefault();
				}
			},
			success: function (e) {
				if (e.response.status == 'success') {
					var article = e.response.msg;
					var articleTemplate = kendo.template($("#article-template").html());
					var articleItem = $("<div class='article'/>");
					var summary = (article.summary) ? article.summary : "";
					articleItem.html(articleTemplate({
						title: article.title,
						summary: summary,
						articleid: article.articleid,
						link: "#" + that.activeCategory.link + '/' + that.activeSubcategory.link +'/' + article.documentId,
						author: article.author,
						featured: article.isFYIFeatured
					}));
					articleItem.hide();
					that.$(".article-list .article").first().before(articleItem);
					articleItem.fadeIn('slow');
					form.find('input').val('');
					$(".k-upload-files.k-reset").find("li").remove();
					Server.caisUser.getLocalSessionInfo(function(user) {
						if (user.caisemployee) {
							that.$('.delete-article').show();
							that.$('.fyi-article').show();
						}
					});
				} else {
					var alert = new Alert("Uploaded File Cannot Exceed 10mb", "OK");
				}
			}
		});
	},
	loadAiGlossary: function() {
		var that = this;
		Server.getAdvisorResourcesGlossary( {}, function(response) {
			var glossary = response;
			this.$(".article-list").empty();
			this.$(".article-content").empty();
			this.$(".header").text("Glossary");
			this.$(".breadcrumb li.root").empty();
			this.$(".breadcrumb li.category").empty();
			this.$(".breadcrumb li.article").empty();
			this.$(".breadcrumb .category-splitter").hide();
			this.$("li.root").text("Glossary");
			
			// parse through the glossary object and render them in the DOM
			var glossaryList = $("<ul class='glossary-list'/>");
			for(var i in glossary) {
				var glossaryItem = $("<li/>");
				var glossaryTerm = $("<p class='term'/>");
				var glossaryExplanation = $("<p class='explanation'/>");
				glossaryTerm.text(glossary[i].term).appendTo(glossaryItem);
				glossaryExplanation.text(glossary[i].explanation).appendTo(glossaryItem);
				glossaryItem.appendTo(glossaryList);
			}
			this.$('.article-list').append(glossaryList);
		});
	}
});
var view = new AdvisorResourcesView();
/*
Advisor router, manages navigation between resource categories and
downloading of articles 
*/
var AdvisorRouter = Backbone.Router.extend({
	routes: {
		":category": "category",
		":category/:subcategory": "subcategory",
		":category/:subcategory/:article": "article",
		"*default": 'defaultRoute'
	},
	// load a resource category
	category: function(cat) {
		view.showMainCategory(cat);
	},
	// load a resource subcategory
	subcategory: function(cat, subcat) {
		view.showSubCategory(cat, subcat);
	},
	// go directly to an article
	article: function(cat, subcat, articleId) {
		setTimeout(function(){
			view.showArticle(cat, subcat, articleId);
		}, 500);
	},
	defaultRoute: function() {
		this.navigate('Alternative_Investments', {trigger: true});
	},
	getCurrentCategories: function() {
		var frag = Backbone.history.getFragment().split('/');
		return {
			category: frag[0],
			subCategory: frag[1],
			articleId: frag[3]
		};
	}
});
var $nextVideo,
	$currentVideo,
	playNextTimeout,
	backCounter = 0;
function videoPlayerFinished(){
	backCounter = 100;
	if($nextVideo && $nextVideo.length>0){
		var $dialogWrapper = $("#video-player"),
			$overlay = $dialogWrapper.find(".video-overlay");
		playNextTimeout = window.setInterval(function(){
			backCounter-=.15;
			var $circle = $($dialogWrapper.find(".progress-circle").first()),
				r = $circle.attr('r'),
				c = Math.PI*(r*2);
			if (backCounter < 0) { backCounter = 0;}
			if (backCounter > 100) { backCounter = 100;}
			var pct = -((100-backCounter)/100)*c;
			$circle.css({ strokeDashoffset: pct});
			if(backCounter == 0){
				clearInterval(playNextTimeout);
				continuePlaying();
			}
		}, 1);
		$overlay.find(".next-title").text($nextVideo.data("title"));
		$overlay.css('display', 'block');
	}else{
		cancelPlaying();
	}
}

function continuePlaying(){
	clearInterval(playNextTimeout);
	$currentVideo.find('.close-video-player').trigger('click');
	$nextVideo.trigger('click');
}
function cancelPlaying(){
	var $dialogWrapper = $("#video-player");
	$dialogWrapper.find('.close-video-player').trigger('click');
}
$(document).on('click', '.article.video', function(){
	$currentVideo = $(this);
	var $dialogWrapper = $("#video-player"),
		$overlay = $dialogWrapper.find(".video-overlay"),
		$body = $("body"),
		videoPlayer = $dialogWrapper.find('video').get(0),
		mp4Vid = $('#mp4Source'),
		src = $currentVideo.data("src"),
		title = $currentVideo.data("title");
	$overlay.css('display', 'none');
	$nextVideo = $currentVideo.next('.video');
	if(videoPlayer){
		mp4Vid.attr('src', src);
		$dialogWrapper.find(".title").html(title);
		videoPlayer.addEventListener('ended',videoPlayerFinished,false);
		videoPlayer.load();
		videoPlayer.play();
	}

	$dialogWrapper.css('display', 'block');
	$body.addClass('freeze-me');
}).on('click', '.close-video-player', function(){
	var $dialogWrapper = $("#video-player"),
		$body = $("body"),
		videoPlayer = $dialogWrapper.find('video').get(0),
		mp4Vid = $('#mp4Source');
	if(videoPlayer){
		mp4Vid.attr('src', '');
		videoPlayer.pause();
		videoPlayer.removeEventListener('ended',videoPlayerFinished,false);
	}
	$dialogWrapper.css('display', 'none');
	$body.removeClass('freeze-me');
	clearInterval(playNextTimeout);
}).on('click', '.continue-playing-videos', continuePlaying).on('click', '.cancel-video-icon', cancelPlaying);


jQuery.download = function(url, data, method) {
	//url and data options required
	if( url && data ){
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ method +'" target="_blank">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	}
};
});