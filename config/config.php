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

$config = array();

/*
 * Не показывать подсказки на длинные урлы логинов
 * например, не показывать для /profile/admin/favourites/
 * а только для /profile/admin/
 */
$config['Leave_Long_Links_Alone'] = true;

/*
 * Количество пользователей блога для показа в подсказке
 * На полный список пользователей будет вести отдельная ссылка
 */
$config['Blog_User_On_Page'] = 7;

/*
 * Показывать подсказки только зарегистрированным пользователям
 */
$config['Only_Registered_Users_Can_See_Info_Tips'] = false;

/*
 * Задержка перед показом подсказки (отправкой запроса к серверу).
 * Время на которое курсор над ссылкой должен остановится чтобы всплыла подсказка
 * Чтобы при случайном "пролете" курсора мыши над ссылкой не посылать ненужные запросы к серверу
 */
$config['Panel_Showing_Delay'] = 600;	// мс

/*
 * Время, в течении которого пользователь после последнего обращения к сайту считается онлайн
 */
$config['Time_To_Stay_Online'] = 900;	// сек

/*
 * ---
 */

$config['url'] = 'popupinfo';
$config['$root$']['router']['page'][$config['url']] = 'PluginPopupinfo_ActionPopupinfo';

return $config;
