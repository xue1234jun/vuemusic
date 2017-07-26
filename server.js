var path = require('path')
var express = require('express')
var http = require('http');
var app = express()
var iconv = require('iconv-lite');
var data = require('./music-data.json');

var apiRoutes = express.Router();

apiRoutes.get('/music-data', function (req, res) {
  res.json({
    errno: 0,
    musicData: data.musicData
  });
});
apiRoutes.get('/lrc/:id', function (req, res) {
  let id = req.params.id;

  function search(src) {
    return new Promise((resolve, reject) => {
      let arrBuf = [];
      let bufLength = 0;
      let url = encodeURI('http://music.qq.com/miniportal/static/lyric/' + src % 100 + '/' + src + '.xml');
      http.get(url, response => {

        response.on('data', chunk => {
          arrBuf.push(chunk);
          bufLength += chunk.length;
        });
        response.on('end', () => {
          let chunkAll = Buffer.concat(arrBuf, bufLength);
          let strJson = iconv.decode(chunkAll, 'gb2312'); // 汉字不乱码
          resolve(strJson);
        })
      })
    })
  }

  search(id)
    .then(searchResult => {
      // var strJson = iconv.decode(searchResult, 'gb2312'); // 汉字不乱码
      // console.log(searchResult)
      res.send(searchResult);
    })
});
apiRoutes.get('/search/:num/:name', (req, res) => {
  let num = req.params.num;
  let name = req.params.name;

  function search(n, keywords) {
    return new Promise((resolve, reject) => {
      let searchResult = '';
      let url = encodeURI('http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=' + n + '&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w=' + keywords);
      http.get(url, response => {
        response.on('data', data => {
          searchResult += data;
        });
        response.on('end', () => {
          resolve(searchResult);
        })
      })
    })
  }

  search(num, name)
    .then(searchResult => {
      res.json(JSON.parse(searchResult));
    })

});

apiRoutes.get('/hot', (req, res) => {
  let hotKeywords = ['歌手', '张杰', '赵雷', '李健', '林志炫', '张碧晨', '梁博', '周笔畅', '张靓颖', '陈奕迅', '周杰伦', '王力宏', 'TFBoys', '李玉刚', '魏晨', '薛之谦'];
  let rHot = new Array(6);
  for (let i = 0; i < rHot.length; i++) {
    let length = hotKeywords.length;
    let random = Math.floor(length * Math.random());
    rHot[i] = hotKeywords[random];
    hotKeywords.splice(random, 1);
  }
  res.json(rHot);

});

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api', apiRoutes);
var port = 8080;


var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
