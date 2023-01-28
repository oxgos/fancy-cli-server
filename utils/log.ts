import npmlog from 'npmlog';

npmlog.heading = 'Fancy';
npmlog.headingStyle = { fg: 'red', bg: 'black' };
npmlog.addLevel('success', 2000, { fg: 'green', bold: true }); // 添加自定义命令

export default npmlog;
