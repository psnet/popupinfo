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

var ls = ls || {};

ls.popupinfo = (function ($) {
	/**
	 * событие для передачи координат мыши в эвент отрисовки подсказки
	 */
	this.storedEvent = null;
	/**
	 * ид таймаута эвента закрытия подсказки
	 */
	this.hideProcId = null;
	/**
	 * ид таймаута эвента открытия подсказки
	 */
	this.showProcId = null;
	/**
	 * задержка в мс перед открытием/закрытием подсказки
	 */
	this.iTimeoutDelay = null;
	/**
	 * объект контейнера подсказки
	 */
	this.oContainer = null;


	/**
	 * Эвент запроса данных объекта
	 *
	 * @param URL		урл
	 * @param Param		ид объекта
	 * @private
	 */
	this._GetMoreInfo = function (URL, Param) {
		ls.ajax(
			URL,
			{ 'param': Param },
			$.proxy(function (data) {
				if (data.bStateError) {
					ls.msg.error(data.sMsgTitle, data.sMsg);
				} else {
					this._ShowMoreInfo(data.sText);
				}
			}, this)
		);
	};


	/**
	 * Отрисовать подсказку
	 *
	 * @param sText		хтмл содержимое подсказки
	 * @private
	 */
	this._ShowMoreInfo = function (sText) {
		/**
		 * переместить подсказку в начало координат чтобы строки не переносились и содержимое выводилось без переносов
		 */
		this.oContainer.css({
			'top': '0px',
			'left': '0px'
		}).html(sText);
		/**
		 * чтобы подсказка была под курсором
		 */
		var iOffsetForMouseCursor = 16;
		/**
		 * вручную установим размер скролбара
		 */
		var iWindowScrollbarSize = 24;
		/**
		 * учитывать пользовательскую панель, если включена, её высота + (2 * padding 5px + 2 * border 1px + 2px shadow offset) = 14px
		 */
		var iOffsetYForOverScreen = (ls.userpanel ? ls.userpanel.OriginalPanelHeight + 14 : iWindowScrollbarSize);
		/**
		 * координаты клика мыши + сдвиг
		 */
		var iXCoord = this.storedEvent.clientX + iOffsetForMouseCursor;
		var iYCoord = this.storedEvent.clientY + iOffsetForMouseCursor;
		/**
		 * рассчитать коориданты таким образом, чтобы подсказка никогда не выходила за размеры видимой области
		 */
		var iWinW = this.oContainer.width();
		var iWinH = this.oContainer.height();
		var iPadW = parseInt(this.oContainer.css('paddingLeft').slice(0, -2)) * 2;	 // padding: left + right
		var iPadH = parseInt(this.oContainer.css('paddingTop').slice(0, -2)) * 2;
		/**
		 * видимая область
		 */
		var iScrW = $(window).width();
		var iScrH = $(window).height();
		/**
		 * если координаты мыши + размер подсказки + отступы больше чем граница экрана - отступ, то "прилепить" к краю
		 */
		if (iXCoord + iWinW + iPadW > iScrW - iWindowScrollbarSize) {
			iXCoord = parseInt(iScrW - iWinW - iPadW - iWindowScrollbarSize);
		}
		if (iYCoord + iWinH + iPadH > iScrH - iOffsetYForOverScreen) {
			iYCoord = parseInt(iScrH - iWinH - iPadH - iOffsetYForOverScreen);
		}
		/**
		 * показать по корректным координатам
		 */
		this.oContainer.css({
			'top': iYCoord + 'px',
			'left': iXCoord + 'px'
		}).fadeIn(400);
	};


	/**
	 * Запустить таймер закрытия подсказки
	 */
	this.StartHidingPanel = function () {
		this.StopHidingPanel();
		this._StopShowingPanel();
		this.hideProcId = setTimeout(function () {
			ls.popupinfo.oContainer.fadeOut(200);
		}, this.iTimeoutDelay);
	};


	/**
	 * Остановить таймер закрытия подсказки
	 */
	this.StopHidingPanel = function () {
		if (this.hideProcId != null) {
			clearTimeout(this.hideProcId);
			this.hideProcId = null;
		}
	};


	/**
	 * Запустить таймер открытия подсказки
	 *
	 * @param URL		урл
	 * @param Param		ид объекта
	 */
	this.StartShowingPanel = function (URL, Param) {
		this._StopShowingPanel();
		this.showProcId = setTimeout($.proxy(function () {
			this.StopHidingPanel();
			this._GetMoreInfo(URL, Param);
		}, this), this.iTimeoutDelay);
	};


	/**
	 * Остановить таймер открытия подсказки
	 *
	 * @private
	 */
	this._StopShowingPanel = function () {
		if (this.showProcId != null) {
			clearTimeout(this.showProcId);
			this.showProcId = null;
		}
	};


	/**
	 * Слушатель для вывода подсказки для логинов пользователей
	 */
	this.AssignListenerForUsers = function (sRequestUrl, bLeaveLongLinks) {
		/**
		 * tip: на весь документ чтобы работать на обновляемом контенте
		 */
		$(document).on(
			{
				'mouseover.popupinfo': function (e) {
					var CurLink = $(this).attr('href').replace(aRouter['profile'], '');
					var LinkChains = CurLink.split('/');

					if ((bLeaveLongLinks) && (LinkChains[1] != '')) return;

					ls.popupinfo.storedEvent = e;
					ls.popupinfo.StartShowingPanel(sRequestUrl, LinkChains[0]);
				},
				'mouseout.popupinfo': function () {
					ls.popupinfo.StartHidingPanel();
				}
			},
			'a[href^="' + aRouter['profile'] + '"]'
		);
	};


	/**
	 * Слушатель для вывода подсказки для блогов
	 */
	this.AssignListenerForBlogs = function (sRequestUrl) {
		$(document).on(
			{
				'mouseover.popupinfo': function (e) {
					var CurLink = $(this).attr('href').replace(aRouter['blog'], '');
					var LinkChains = CurLink.split('/');

					/**
					 * tip: "edit" имеет третий параметр, поэтому его включать в список не нужно
					 */
					if ((LinkChains[1] != '') || ($.inArray(LinkChains[0], ['add', 'bad', 'newall', 'discussed', 'top', 'new']) != -1)) {
						return;
					}

					ls.popupinfo.storedEvent = e;
					ls.popupinfo.StartShowingPanel(sRequestUrl, LinkChains[0]);
				},
				'mouseout.popupinfo': function () {
					ls.popupinfo.StartHidingPanel();
				}
			},
			'a[href^="' + aRouter['blog'] + '"]'
		);
	};


	/**
	 * Первичная настройка модуля
	 *
	 * @param iDelay		задержка отображения
	 */
	this.Initialize = function (iDelay) {
		this.iTimeoutDelay = iDelay;
		this.oContainer = $('#Popupinfo_MoreInfoContainer');
		/**
		 * Для движений мыши по обертке
		 */
		this.oContainer.on('mouseover.popupinfo', function () {
			ls.popupinfo.StopHidingPanel();
		}).on('mouseout.popupinfo', function () {
			ls.popupinfo.StartHidingPanel();
		});
	};

	// ---

	return this;

}).call(ls.popupinfo || {}, jQuery);
