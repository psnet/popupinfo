
<!-- Popupinfo plugin -->
<script>
	jQuery(document).ready(function($) {
		ls.popupinfo.Initialize({Config::Get("plugin.popupinfo.Panel_Showing_Delay")});
		ls.popupinfo.AssignListenerForUsers("{router page='popupinfo'}ajax-get-user-info/", {json var=Config::Get("plugin.popupinfo.Leave_Long_Links_Alone")});
		ls.popupinfo.AssignListenerForBlogs("{router page='popupinfo'}ajax-get-blog-info/");
	});
</script>
<div id="Popupinfo_MoreInfoContainer">
	<a href="https://github.com/psnet">LiveStreet CMS Guide by PSNet - мануал по разработке</a>
</div>
<!-- /Popupinfo plugin -->
