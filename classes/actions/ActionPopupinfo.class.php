<?php
/**
 * Popupinfo plugin
 *
 * @copyright Serhii Pustovit (PSNet), 2008 - 2015
 * @author    Serhii Pustovit (PSNet) <light.feel@gmail.com>
 *
 * @link      https://github.com/psnet
 * @link      http://livestreet.ru/profile/PSNet/
 * @link      https://catalog.livestreetcms.com/profile/PSNet/
 * @link      http://livestreetguide.com/developer/PSNet/
 */

class PluginPopupinfo_ActionPopupinfo extends ActionPlugin {

	protected $oUserCurrent = null;


	public function Init() {
		$this->oUserCurrent = $this->User_GetUserCurrent();

		if (Config::Get('plugin.popupinfo.Only_Registered_Users_Can_See_Info_Tips') and !$this->oUserCurrent) {
			return Router::Action('error');
		}

		$this->SetDefaultEvent('getuserinfo');
	}


	protected function RegisterEvent() {
		$this->AddEvent('ajax-get-user-info', 'EventAjaxUserInfo');
		$this->AddEvent('ajax-get-blog-info', 'EventAjaxBlogInfo');
	}


	/**
	 * Get user information
	 *
	 * @return bool
	 */
	public function EventAjaxUserInfo() {
		$this->Viewer_SetResponseAjax('json');

		$sUserLogin = getRequest('param');

		if (!is_string($sUserLogin) or !func_check($sUserLogin, 'login', 3, 50)) {
			$this->Message_AddError('Error in user`s login');

			return false;
		}

		if (!$oUser = $this->User_GetUserByLogin($sUserLogin)) {
			return false;
		}

		$iCountTopicUser = $this->Topic_GetCountTopicsPersonalByUser($oUser->getId(), 1);
		$iCountCommentUser = $this->Comment_GetCountCommentsByUserId($oUser->getId(), 'topic');
		$oGeoTarget = $this->Geo_GetTargetByTarget('user', $oUser->getId());

		$oViewer = $this->Viewer_GetLocalViewer();
		$oViewer->Assign('oUser', $oUser);
		$oViewer->Assign('iCountTopicUser', $iCountTopicUser);
		$oViewer->Assign('iCountCommentUser', $iCountCommentUser);
		$oViewer->Assign('oGeoTarget', $oGeoTarget);
		$oViewer->Assign('oUserCurrent', $this->oUserCurrent);

		$this->Viewer_AssignAjax('sText', $oViewer->Fetch(Plugin::GetTemplatePath(__CLASS__) . '/getuserinfo.tpl'));
	}


	/**
	 * Get information about the blog
	 *
	 * @return bool
	 */
	public function EventAjaxBlogInfo() {
		$this->Viewer_SetResponseAjax('json');

		$sBlogName = getRequest('param');

		if (!is_string($sBlogName) or !func_check($sBlogName, 'login', 3, 50)) {
			$this->Message_AddError('Error in blog`s name');

			return false;
		}

		if (!$oBlog = $this->Blog_GetBlogByUrl($sBlogName)) {
			return false;
		}

		// get blog users with all roles
		$aBlogAdministratorsResult = $this->Blog_GetBlogUsersByBlogId($oBlog->getId(), ModuleBlog::BLOG_USER_ROLE_ADMINISTRATOR);
		$aBlogAdministrators = $aBlogAdministratorsResult ['collection'];

		$aBlogModeratorsResult = $this->Blog_GetBlogUsersByBlogId($oBlog->getId(), ModuleBlog::BLOG_USER_ROLE_MODERATOR);
		$aBlogModerators = $aBlogModeratorsResult ['collection'];

		$aBlogUsersResult = $this->Blog_GetBlogUsersByBlogId($oBlog->getId(), ModuleBlog::BLOG_USER_ROLE_USER, 1, Config::Get('plugin.popupinfo.Blog_User_On_Page'));
		$aBlogUsers = $aBlogUsersResult ['collection'];

		$oViewer = $this->Viewer_GetLocalViewer();
		$oViewer->Assign('oBlog', $oBlog);
		$oViewer->Assign('aBlogAdministrators', $aBlogAdministrators);
		$oViewer->Assign('aBlogModerators', $aBlogModerators);
		$oViewer->Assign('aBlogUsers', $aBlogUsers);
		$oViewer->Assign('iCountBlogAdministrators', $aBlogAdministratorsResult ['count'] + 1);
		$oViewer->Assign('iCountBlogModerators', $aBlogModeratorsResult ['count']);
		$oViewer->Assign('iCountBlogUsers', $aBlogUsersResult ['count']);
		$oViewer->Assign('oUserCurrent', $this->oUserCurrent);

		$this->Viewer_AssignAjax('sText', $oViewer->Fetch(Plugin::GetTemplatePath(__CLASS__) . '/getbloginfo.tpl'));
	}

}
