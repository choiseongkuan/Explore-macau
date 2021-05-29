
const listItem = Vue.component('listItem',{
    template: `
    <div>
        <h2 class="sub-title">Main category</h2>
        <div id="acc">
            <li class="list-class fixed" v-on:click="toAll" id="all-category">
            <div class="mask"></div>
                <div class="icon">
                    <img src="./icon/all.svg">
                    <span>All category</span>
                </div>
            </li>
            <li class="list-class fixed" v-on:click="toFav" id="favourite-category">
            <div class="mask"></div>
                <div class="icon">
                    <img src="./icon/favourite.svg">
                    <span>Favourite</span>
                </div>
            </li>
        </div>
        <h2 class="sub-title">Other category</h2>
        <li class="list-class" v-for="list in listClass" v-on:click="toClass" v-on:dblclick="toggleDeletePage" v-bind:id="list.classUid" >
        <span>{{list.name}}</span>
        </li>
        <div class="delete-page" v-show="deletePage">
            <div class="background" v-on:click="toggleDeletePage"></div>
            <div class="delete-container">
                <div class="text">Are you sure to delete ?</div>
                <div class="delete-button">
                <button class="white-btn" v-on:click="toggleDeletePage">Cancel</button>
                <button class="button-class" v-on:click="deleteClass">Confirm</button>
                </div>
            </div>
        </div>
    
    </div>
            `,
    data(){
        return {
            timer: null,
            deletePage: false,
            index: null
        }
    },
    computed: {
        listClass(){
            return this.$store.state.listClass;
        }
    },
    methods: {
        toggleDeletePage(e){//防止單擊與雙擊衝突（雙擊）
            timers = this.timer
            if(timers){
                window.clearTimeout(timers);
                this.timer = null
            };
            this.index = this.listClass.map(x => x.classUid).indexOf(parseInt(e.target.getAttribute("id")));//獲得目標id
            this.deletePage = !this.deletePage;
        },
        deleteClass(){
            const playload = {
                index: this.index
                };
            console.log(playload)
            this.$store.commit('deleteClass',playload);//傳送數據
            this.deletePage = !this.deletePage;
            
        },
        toAll(){
            this.$router.push('all');//跳轉至all
        },
        toFav(){
            this.$router.push('favourite');//跳轉至favourite
        },
        toClass(e){//防止單擊與雙擊衝突（單擊）
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                this.$router.push('./class/'+ e.target.id);
            },200);
        }
    }
});

const addClass = Vue.component('addClass',{
    template:`
    <div id="footer">
        <div class="buttons">
            <div class="add" id="add-btn" v-on:click="toggleBtn" v-bind:class="buttonShow?'rotate-in':'rotate-out'">
                <img src="./icon/add.svg">
            </div>
            <div class="add add-category"  v-on:click="showPage" v-bind:class="buttonShow?'category-in':'category-out'">
                <img src="./icon/class.svg">
            </div>
            <label class="add add-store" for="file-input" v-on:change="onChange" v-bind:class="buttonShow?'store-in':'store-out'">
                <img src="./icon/camera.svg">
                <input type="file" id="file-input" accept="image">
            </label>
            <div class="background" v-show="buttonShow"></div>
        </div>
        <div class="inputPage" v-show="seen">
            <form v-on:submit.prevent="onSubmit">
                <input type="text" placeholder="Enter new category" required v-model="className" class="input-class" >
                <button type="submit" class="button-class">Submit</button>
            </form>
            <div class="background" v-on:click="showPage(),toggleBtn()"></div>
        </div>
        <div id="addEnt" v-show="formseen">
        <form v-on:submit.prevent="onFormSubmit">
            <div id=map-container>
            </div>
            <div id="location-mainrow">
                <div id="location-message">
                    <input id="location-name" type="text" placeholder="Enter new location" v-model="name" required>
                    <div id="location">{{location}}</div>
                </div>
                <div id="favourite"><img src="./icon/star.svg" v-show="!favourite" v-on:click="handleStar"><img v-show="favourite" src="./icon/star_2.svg" v-on:click="handleStar"></div>
            </div>
            <div id="form-input">
                <div class="select-class">
                    <span>Category</span>
                        <select class="input-class" v-model="selected" required>
                            <option v-for="option in options" v-bind:value="option.classUid">
                                {{option.name}}
                            </option>
                        </select>
                        <span id="triangle"></span>
                </div>
                <div class="text-area-class"><span>Comment</span><textarea class="input-class" v-model="comment"></textarea></div>
                <div class="pictures">
                    <span>Pictures</span>
                    <div id="picture-row">
                        <div id="photo">
                            <img v-for="img in imgs"  class="img-class" v-bind:src="img" v-on:click="getDataURL" v-on:dblclick="deletePhoto">
                            <label id="add-photo" for="add-file" v-on:change="addFile">
                                <img src="./icon/add-photo.svg">
                                <input type="file" id="add-file">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="line"></div>
            <div id="btn-row">
                <button id="cancel" class="white-btn" type="button" v-on:click="formshowPage">CANCEL</button>
                <div id="submit-row">
                
                <button id="sumbit-btn" class="button-class" type="submit" v-bind:class="location=='loading......'?'btn-disable':''">ADD</button>
                </div>
            </div>
        </form>
        <div class="background""></div>
    </div>
    <div id="showPhoto" v-show="showPhotoPage">
        <img v-bind:src="showPhoto">
    <div class="background black"  v-on:click="handleShowPhoto"></div>
    </div>
    <div id="share-page" v-show="sharePage">
            <form v-on:submit.prevent="selectedMethod=='email'?sendEmail():useOtherMethod()">
                <div id="share-container">
                    <h3>Share through</h3>
                    <div id="email-method" >
                        <input type="radio" name="method" class="radio-class" id="email" value="email" v-model="selectedMethod" required>
                        <label for="email">Email</label>
                        <input type="email" class="input-class" id="email-address" placeholder="Send to..." v-model="emailAddress">
                    </div>
                    <div id="other-method" >
                        <input type="radio" name="method" class="radio-class" id="other" value="other" v-model="selectedMethod" required>
                        <label for="other">Other Methods</label>
                    </div>
                    <div class="line"></div>
                    <div id="share-btn-row">
                        <button class="white-btn" v-on:click="toggleSharePage" type="button">CANCEL</button>
                        <button class="button-class" type="submit">SHARE</button>
                    </div>
                </div>
            </form>
            <div class="background"></div>
        </div>
    </div>
    `,
    data(){
        return{
            emailAddress: "",
            selectedMethod: "",
            sharePage: false,
            lat: null,
            long: null,
            buttonShow: false,
            className: "",
            seen: false,
            timer: null,
            formseen: false,
            name: "",
            selected: "",
            imgs: [],
            location: "loading......",
            comment: "",
            favourite: false,
            showPhoto: "",
            showPhotoPage: false,
        }
    },

    watch: {
        seen(){
            if(this.seen){
                
                // $('header,main,.add').addClass('blur');
                $('#add-btn,.add').css('z-index','0');
            }
            else{
                
                // $('header,main,.add').removeClass('blur');
                $('.add').css('z-index','1')
                $('#add-btn').css('z-index','2');
            }
        },
        formseen(){
            if(this.formseen){
                
                // $('header,main,.add').addClass('blur');
                $('.add').css('z-index','0');
                $('#add-btn').css('z-index','0');
            }
            else{
                
                // $('header,main,.add').removeClass('blur');
                $('.add').css('z-index','1')
                $('#add-btn').css('z-index','1');
            }
        },
        buttonShow(){
            if(this.buttonShow){
                
                // $('header,main').addClass('blur');
                $('.add').css('z-index','1');
                $('#add-btn').css('z-index','2');
            }
            else{
                
                // $('header,main').removeClass('blur');
                $('.add').css('z-index','0');
                $('#add-btn').css('z-index','1')
            }
        }
    },
    computed: {
        options(){
            return this.$store.state.listClass
        }
    },

    methods: {
        useOtherMethod(){
            let fileArray = [];
            for(i in this.imgs){//將base64轉為file
                fileArray.push(dataURLtoFile(this.imgs[i],'photo'+i));
            }
            if (navigator.canShare && navigator.canShare({ files: fileArray })) {
                navigator.share({//判斷browser是否支持web share api，目前ios全部browser都不支持
                  title: 'Share photos',
                  text: 'Photos take form'+this.location,
                  files: fileArray
                })
                .then(() => this.sharePage = !this.sharePage)
                .catch((error) => alert('Sharing failed ' + error));
              }
            else
            {
                alert("Sorry, your browser does not support this function")
            }
        },
        sendEmail(){
            let imgTag = '';
            for(i in this.imgs){//將圖片生成img tag
                imgTag = imgTag.concat("<img src='" +this.imgs[i]+ "' width='200px'></img>");
            };
            window.location.href = 'mailto:'+this.emailAddress+'?suject=Location&body=Name: '+this.name+'<br>Location: '+this.location+'<br>Comment: '+this.comment+'<br>'+imgTag;
            this.sharePage = !this.sharePage
        },
        toggleSharePage(){
    
            this.sharePage = !this.sharePage;
        },
        toggleBtn(){
            this.buttonShow = !this.buttonShow;
        },
        deletePhoto(e){
            timers = this.timer
            if(timers){
                window.clearTimeout(timers);
                this.timer = null
            }
            
            this.imgs.splice(this.imgs.indexOf(e.target.getAttribute("src")),1);
        },
        onFormSubmit(){
            const playload = {
                photo: this.imgs,
                name: this.name,
                location: this.location,
                comment: this.comment,
                class: this.selected,
                favourite: this.favourite,
                locationUid: new Date().getTime(),
                lat: this.lat,
                long: this.long
            }
    
            this.$store.commit('addEnt', playload);//傳送數據
            this.formseen = !this.formseen;
            this.buttonShow = !this.buttonShow
            
        },
        handleShowPhoto(){
            this.showPhotoPage = !this.showPhotoPage;
        },
        getDataURL(e){//防止單雙擊衝突
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                const dataURL = e.target.getAttribute("src");
                this.showPhoto = dataURL;
                this.showPhotoPage = !this.showPhotoPage;
            },200);
        },
        onChange(e){
            this.imgs = [];
            this.name = "";
            this.location = "";
            this.comment = "";
            this.selected = "";
            this.favourite = false;
            this.lat = null;
            this.long = null;
            $('#map-container').html('<div id="map" style="width:100%;height:100%;margin:0;border-radius:5px 5px 0 0;"></div>');//刷新地圖容器
            this.location = 'loading......';
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position)=>{//獲得gps地址
                    this.lat = position.coords.latitude;
                    this.long = position.coords.longitude;
                    var map;//載入地圖
                    if(map != undefined){ map.remove();}
                    map = L.map('map').setView([this.lat, this.long], 16.5);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                            maxZoom: 18,
                    }).addTo(map);
                    var marker = L.marker([this.lat, this.long]);
                    marker.addTo(map);
                    $.ajax({//調用api
                        url: 'https://kinoras.com/dev/api/geocoding/?key=28423118&long='+this.long+'&lati='+this.lat+'&lang=pt',
                        error: () =>{
                            console.log('error')
                        },
                        success: (data)=>{
                            this.location = JSON.parse(data).nmaddress;
                            if(this.location == ", , "){//防止api返回無效地址
                                this.location = 'fail to load location please try again';
                            }
                        }
                    })
                },(err)=>{
                    console.location(err);
                });
            }
            else{
                alert("無法獲取gps定位");
            };
            addPhoto(e).then(value => this.imgs.push(value));
            this.formseen = !this.formseen;
        },
        addFile(e){
            addPhoto(e).then(value => this.imgs.push(value));
        },
        handleStar(){
            this.favourite = !this.favourite;
        },
        showPage(){
            this.seen = !this.seen;
        },
        onSubmit(){
            if(this.$store.state.listClass.some(x => x.name == this.className)){
                alert("The input value cannot be repeated");//防止重複
            }
            else{
                const playload = {
                    name: this.className,
                    classUid : new Date().getTime()//生成uid
                }
                this.$store.commit('addClass',playload);
                this.seen = !this.seen;
                this.buttonShow = !this.buttonShow;
                this.className = '';
            }
        },
        formshowPage(){
            this.className = "";
            this.formseen = !this.formseen;
            this.buttonShow = !this.buttonShow;
        }
    }
});
const listAll = Vue.component('listAll',{
    template: `
    <div>
        <h2 class="class-name">All category</h2>
        <ul>
            <li v-for="data in datas" class="list-class" v-bind:id="data.locationUid" v-on:dblclick="getTargetId" v-on:click="changeLocation">
                <img class="item-photo" v-bind:src="data.photo[0]">
                <div>
                    <div>{{data.name}} </div>
                    <div class="location">{{data.location}}</div>
                </div>
            </li>
        </ul>
        <div class="delete-page" v-show="deletePage">
            <div class="background" v-on:click="toggleDeletePage"></div>
            <div class="delete-container">
                <div class="text">Are you sure to delete ?</div>
                <div class="delete-button">
                <button class="white-btn" v-on:click="toggleDeletePage">Cancel</button>
                <button class="button-class" v-on:click="deleteLocation">Confirm</button>
                </div>
            </div>
        </div>
        <div id="addEnt" v-show="formseen">
            <form v-on:submit.prevent="onFormChange">
                <div id=map-container>
                </div>
                <div id="location-mainrow">
                    <div id="location-message">
                        <input id="location-name" type="text" placeholder="Enter new location" v-model="name" v-bind:class="changing?'':'disable'" required>
                        <div id="location">{{location}}</div>
                    </div>
                    <div id="favourite" v-bind:class="changing?'':'disable'"><img src="./icon/star.svg" v-show="!favourite" v-on:click="handleStar"><img v-show="favourite" src="./icon/star_2.svg" v-on:click="handleStar"></div>
                </div>
                <div id="form-input">
                    <div class="select-class">
                        <span>Category</span>
                            <select class="input-class" v-model="selected" v-bind:class="changing?'':'disable'" required>
                                <option v-for="option in options" v-bind:value="option.classUid">
                                    {{option.name}}
                                </option>
                            </select>
                            <span id="triangle" v-show="changing"></span>
                    </div>
                    <div class="text-area-class"><span>Comment</span><textarea class="input-class" v-model="comment" v-bind:class="changing?'':'disable'"></textarea></div>
                    <div class="pictures">
                        <span>Pictures</span>
                        <div id="picture-row">
                            <div id="photo">
                                <img v-for="img in imgs"  class="img-class" v-bind:src="img" v-on:click="getDataURL" v-on:dblclick="deletePhoto">
                                <label id="add-photo" for="add-file" v-on:change="addFile" v-bind:class="changing?'':'disable'" v-show="changing">
                                    <img src="./icon/add-photo.svg">
                                    <input type="file" id="add-file">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
                <div id="btn-row">
                    <button id="cancel" class="white-btn" type="button" v-on:click="formshowPage">CANCEL</button>
                    <div id="submit-row">
                    
                    <button id="sumbit-btn" class="button-class change-btn" type="button" v-show="nochange" v-on:click="gochange">EDIT</button>
                    <button class="button-class change-btn" type="submit" v-show="changing">CONFIRM</button>
                    </div>
                </div>
            </form>
            <div class="background""></div>
        </div>
        <div id="showPhoto" v-show="showPhotoPage">
            <img v-bind:src="showPhoto">
            <div class="background black"  v-on:click="handleShowPhoto"></div>
        </div>
        <div id="share-page" v-show="sharePage">
            <form v-on:submit.prevent="selectedMethod=='email'?sendEmail():useOtherMethod()">
                <div id="share-container">
                    <h3>Share through</h3>
                    <div id="email-method" >
                        <input type="radio" name="method" class="radio-class" id="email" value="email" v-model="selectedMethod" required>
                        <label for="email">Email</label>
                        <input type="email" class="input-class" id="email-address" placeholder="Send to..." v-model="emailAddress">
                    </div>
                    <div id="other-method" >
                        <input type="radio" name="method" class="radio-class" id="other" value="other" v-model="selectedMethod" required>
                        <label for="other">Other Methods</label>
                    </div>
                    <div class="line"></div>
                    <div id="share-btn-row">
                        <button class="white-btn" v-on:click="toggleSharePage" type="button">CANCEL</button>
                        <button class="button-class" type="submit">SHARE</button>
                    </div>
                </div>
            </form>
            <div class="background"></div>
        </div>
        <div id="share-page" v-show="sharePage">
            <form v-on:submit.prevent="selectedMethod=='email'?sendEmail():useOtherMethod()">
                <div id="share-container">
                    <h3>Share through</h3>
                    <div id="email-method" >
                        <input type="radio" name="method" class="radio-class" id="email" value="email" v-model="selectedMethod" required>
                        <label for="email">Email</label>
                        <input type="email" class="input-class" id="email-address" placeholder="Send to..." v-model="emailAddress">
                    </div>
                    <div id="other-method" >
                        <input type="radio" name="method" class="radio-class" id="other" value="other" v-model="selectedMethod" required>
                        <label for="other">Other Methods</label>
                    </div>
                    <div class="line"></div>
                    <div id="share-btn-row">
                        <button class="white-btn" v-on:click="toggleSharePage" type="button">CANCEL</button>
                        <button class="button-class" type="submit">SHARE</button>
                    </div>
                </div>
            </form>
            <div class="background"></div>
        </div>
    </div>
    `,
    data(){
        return {
            emailAddress: "",
            selectedMethod: "",
            sharePage: false,
            timer: null,
            deletePage: false,
            selectedId: "",
            nochange: true,
            changing: false,
            lat: null,
            long: null,
            formseen: "",
            location: "",
            name: "",
            selected: "",
            imgs: [],
            comment: "",
            showPhoto: "",
            showPhotoPage: false,
            favourite: false,
            index: null
        }
    },
    computed: {
        datas(){
            return this.$store.state.data;
        },
        options(){
            return this.$store.state.listClass;
        }
    },
    methods: {
        useOtherMethod(){
            let fileArray = [];
            for(i in this.imgs){//圖片轉file
                fileArray.push(dataURLtoFile(this.imgs[i],'photo'+i));
            }
            if (navigator.canShare && navigator.canShare({ files: fileArray })) {
                navigator.share({
                  title: 'Share photos',
                  text: 'Photos take form'+this.location,
                  files: fileArray
                })
                .then(() => this.sharePage = !this.sharePage)
                .catch((error) => alert('Sharing failed ' + error));
              }
            else
            {
                alert("Sorry, your browser does not support this function")
            }
        },
        sendEmail(){
            let imgTag = '';
            for(i in this.imgs){
                imgTag = imgTag.concat("<img src='" +this.imgs[i]+ "' width='200px'></img>");
            };
            window.location.href = 'mailto:'+this.emailAddress+'?suject=Location&body=Name: '+this.name+'<br>Location: '+this.location+'<br>Comment: '+this.comment+'<br>'+imgTag;
            this.sharePage = !this.sharePage
        },
        toggleSharePage(){
            this.sharePage = !this.sharePage;
        },
        gochange(){
            this.nochange = !this.nochange;
            this.changing = !this.changing;
        },
        handleShowPhoto(){
            this.showPhotoPage = !this.showPhotoPage;
        },
        changeLocation(e){
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{//避免地圖加載不全
                this.nochange = true;
                this.changing = false
                $('#map-container').html('<div id="map" style="width:100%;height:100%;margin:0;border-radius:5px 5px 0 0;"></div>');
                const targetLocation = this.datas[this.datas.map(x => x.locationUid).indexOf(parseInt(e.target.getAttribute("id")))];
                this.index = this.datas.map(x => x.locationUid).indexOf(parseInt(e.target.getAttribute("id")));
                this.name = targetLocation.name;
                this.location = targetLocation.location;
                this.favourite = targetLocation.favourite;
                this.comment = targetLocation.comment;
                this.selected = targetLocation.class;
                this.imgs = targetLocation.photo;
                this.formseen = !this.formseen;
                this.lat = targetLocation.lat;
                this.long = targetLocation.long;
                window.setTimeout(()=>{
                    var map;
                    map = L.map('map').setView([this.lat, this.long], 16.5);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                            maxZoom: 18,
                    }).addTo(map);
                    var marker = L.marker([this.lat, this.long]);
                    marker.addTo(map);
                },100)
            },200);
     
        },
        addFile(e){
            addPhoto(e).then(value => this.imgs.push(value));
        },
        formshowPage(){
            this.className = "";
            this.formseen = !this.formseen;
        },
        handleStar(){
            this.favourite = !this.favourite;
        },
        onFormChange(){
            const playload = {
                index: this.index,
                photo: this.imgs,
                name: this.name,
                location: this.location,
                comment: this.comment,
                class: this.selected,
                favourite: this.favourite,
            }
            this.$store.commit('changeLocation', playload);
            this.formseen = !this.formseen;
        },
        getDataURL(e){//防止單雙擊衝突
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                const dataURL = e.target.getAttribute("src");
                this.showPhoto = dataURL;
                this.showPhotoPage = !this.showPhotoPage;
            },200);
        },
        deletePhoto(e){//防止單雙擊衝突
            if(this.changing){
                timers = this.timer
                if(timers){
                    window.clearTimeout(timers);
                    this.timer = null
                }
                this.imgs.splice(this.imgs.indexOf(e.target.getAttribute("src")),1);
            }
        },
        toggleDeletePage(){
            this.deletePage = !this.deletePage;
        },
        getTargetId(e){
            timers = this.timer
            if(timers){
                window.clearTimeout(timers);
                this.timer = null
            };
            this.selectedId = e.target.getAttribute("id");
            this.deletePage = !this.deletePage;
        },
        deleteLocation(){
            const playload = {
                index:this. datas.map(x => x.locationUid).indexOf(parseInt(this.selectedId))
            };
            if(playload.index == -1){//防止index獲取錯誤
                alert('Unexpected error, please rty again');
            }
            else{
                vm.$store.commit('deleteLocation',playload);
            }
            this.deletePage = !this.deletePage;
        },
    },
});
const listFavourite = Vue.component('listFavourite',{
    template: `
    <div>
        <h2 class="class-name">Favourite</h2>
        <ul>
            <li v-for="data in datas" class="list-class" v-bind:id="data.locationUid" v-on:dblclick="getTargetId" v-on:click="changeLocation">
                <img class="item-photo" v-bind:src="data.photo[0]">
                <div>
                    <div>{{data.name}} </div>
                    <div class="location">{{data.location}}</div>
                </div>
            </li>
        </ul>
        <div class="delete-page" v-show="deletePage">
            <div class="background" v-on:click="toggleDeletePage"></div>
            <div class="delete-container">
                <div class="text">Are you sure to delete ?</div>
                <div class="delete-button">
                <button class="white-btn" v-on:click="toggleDeletePage">Cancel</button>
                <button class="button-class" v-on:click="deleteLocation">Confirm</button>
                </div>
            </div>
        </div>
        <div id="addEnt" v-show="formseen">
            <form v-on:submit.prevent="onFormChange">
                <div id=map-container>
                </div>
                <div id="location-mainrow">
                    <div id="location-message">
                        <input id="location-name" type="text" placeholder="Enter new location" v-model="name" v-bind:class="changing?'':'disable'" required>
                        <div id="location">{{location}}</div>
                    </div>
                    <div id="favourite" v-bind:class="changing?'':'disable'"><img src="./icon/star.svg" v-show="!favourite" v-on:click="handleStar"><img v-show="favourite" src="./icon/star_2.svg" v-on:click="handleStar"></div>
                </div>
                <div id="form-input">
                    <div class="select-class">
                        <span>Category</span>
                            <select class="input-class" v-model="selected" v-bind:class="changing?'':'disable'" required>
                                <option v-for="option in options" v-bind:value="option.classUid">
                                    {{option.name}}
                                </option>
                            </select>
                            <span id="triangle" v-show="changing"></span>
                    </div>
                    <div class="text-area-class"><span>Comment</span><textarea class="input-class" v-model="comment" v-bind:class="changing?'':'disable'"></textarea></div>
                    <div class="pictures">
                        <span>Pictures</span>
                        <div id="picture-row">
                            <div id="photo">
                                <img v-for="img in imgs"  class="img-class" v-bind:src="img" v-on:click="getDataURL" v-on:dblclick="deletePhoto">
                                <label id="add-photo" for="add-file" v-on:change="addFile" v-bind:class="changing?'':'disable'" v-show="changing">
                                    <img src="./icon/add-photo.svg">
                                    <input type="file" id="add-file">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
                <div id="btn-row">
                    <button id="cancel" class="white-btn" type="button" v-on:click="formshowPage">CANCEL</button>
                    <div id="submit-row">
                    
                    <button id="sumbit-btn" class="button-class change-btn" type="button" v-show="nochange" v-on:click="gochange">EDIT</button>
                    <button class="button-class change-btn" type="submit" v-show="changing">CONFIRM</button>
                    </div>
                </div>
            </form>
            <div class="background""></div>
        </div>
        <div id="showPhoto" v-show="showPhotoPage">
            <img v-bind:src="showPhoto">
            <div class="background black"  v-on:click="handleShowPhoto"></div>
        </div>
        <div id="share-page" v-show="sharePage">
            <form v-on:submit.prevent="selectedMethod=='email'?sendEmail():useOtherMethod()">
                <div id="share-container">
                    <h3>Share through</h3>
                    <div id="email-method" >
                        <input type="radio" name="method" class="radio-class" id="email" value="email" v-model="selectedMethod" required>
                        <label for="email">Email</label>
                        <input type="email" class="input-class" id="email-address" placeholder="Send to..." v-model="emailAddress">
                    </div>
                    <div id="other-method" >
                        <input type="radio" name="method" class="radio-class" id="other" value="other" v-model="selectedMethod" required>
                        <label for="other">Other Methods</label>
                    </div>
                    <div class="line"></div>
                    <div id="share-btn-row">
                        <button class="white-btn" v-on:click="toggleSharePage" type="button">CANCEL</button>
                        <button class="button-class" type="submit">SHARE</button>
                    </div>
                </div>
            </form>
            <div class="background"></div>
        </div>
    </div>
    `,
    data(){
        return {
            emailAddress: "",
            selectedMethod: "",
            sharePage: false,
            timer: null,
            deletePage: false,
            selectedId: "",
            nochange: true,
            changing: false,
            lat: null,
            long: null,
            formseen: "",
            location: "",
            name: "",
            selected: "",
            imgs: [],
            comment: "",
            showPhoto: "",
            showPhotoPage: false,
            favourite: false,
            index: null
        }
    },
    computed: {
        datas(){
            return this.$store.state.data.filter(data => data.favourite == true);
        },
        options(){
            return this.$store.state.listClass;
        }
    },
    methods: {
        useOtherMethod(){
            let fileArray = [];
            for(i in this.imgs){
                fileArray.push(dataURLtoFile(this.imgs[i],'photo'+i));
            }
            if (navigator.canShare && navigator.canShare({ files: fileArray })) {
                navigator.share({
                  title: 'Share photos',
                  text: 'Photos take form'+this.location,
                  files: fileArray
                })
                .then(() => this.sharePage = !this.sharePage)
                .catch((error) => alert('Sharing failed '+ error));
              }
            else
            {
                alert("Sorry, your browser does not support this function")
            }
        },
        sendEmail(){
            let imgTag = '';
            for(i in this.imgs){
                imgTag = imgTag.concat("<img src='" +this.imgs[i]+ "' width='200px'></img>");
            };
            window.location.href = 'mailto:'+this.emailAddress+'?suject=Location&body=Name: '+this.name+'<br>Location: '+this.location+'<br>Comment: '+this.comment+'<br>'+imgTag;
            this.sharePage = !this.sharePage
        },
        toggleSharePage(){
            this.sharePage = !this.sharePage;
        },
        gochange(){
            this.nochange = !this.nochange;
            this.changing = !this.changing;
        },
        handleShowPhoto(){
            this.showPhotoPage = !this.showPhotoPage;
        },
        changeLocation(e){
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                this.nochange = true;
                this.changing = false
                $('#map-container').html('<div id="map" style="width:100%;height:100%;margin:0;border-radius:5px 5px 0 0;"></div>');
                const targetLocation = this.datas[this.datas.map(x => x.locationUid).indexOf(parseInt(e.target.getAttribute("id")))];
                this.index = this.datas.map(x => x.locationUid).indexOf(parseInt(e.target.getAttribute("id")));
                this.name = targetLocation.name;
                this.location = targetLocation.location;
                this.favourite = targetLocation.favourite;
                this.comment = targetLocation.comment;
                this.selected = targetLocation.class;
                this.imgs = targetLocation.photo;
                this.formseen = !this.formseen;
                this.lat = targetLocation.lat;
                this.long = targetLocation.long;
                window.setTimeout(()=>{
                    var map;
                    map = L.map('map').setView([this.lat, this.long], 16.5);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                            maxZoom: 18,
                    }).addTo(map);
                    var marker = L.marker([this.lat, this.long]);
                    marker.addTo(map);
                },100)
            },200);
     
        },
        addFile(e){
            addPhoto(e).then(value => this.imgs.push(value));
        },
        formshowPage(){
            this.className = "";
            this.formseen = !this.formseen;
        },
        handleStar(){
            this.favourite = !this.favourite;
        },
        onFormChange(){
            const playload = {
                index: this.index,
                photo: this.imgs,
                name: this.name,
                location: this.location,
                comment: this.comment,
                class: this.selected,
                favourite: this.favourite,
            }
            this.$store.commit('changeLocation', playload);
            this.formseen = !this.formseen;
        },
        getDataURL(e){
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                const dataURL = e.target.getAttribute("src");
                this.showPhoto = dataURL;
                this.showPhotoPage = !this.showPhotoPage;
            },200);
        },
        deletePhoto(e){
            if(this.changing){
                timers = this.timer
                if(timers){
                    window.clearTimeout(timers);
                    this.timer = null
                }
                
                this.imgs.splice(this.imgs.indexOf(e.target.getAttribute("src")),1);
            }
        },


        toggleDeletePage(){
            this.deletePage = !this.deletePage;
        },
        getTargetId(e){
            timers = this.timer
            if(timers){
                window.clearTimeout(timers);
                this.timer = null
            };
            this.selectedId = e.target.getAttribute("id");
            this.deletePage = !this.deletePage;
        },
        deleteLocation(){
            const playload = {
                index: this.datas.map(x => x.locationUid).indexOf(parseInt(this.selectedId))
            };
            if(playload.index == -1){
                alert('Unexpected error, please rty again');
            }
            else{
                vm.$store.commit('deleteLocation',playload);
            }
            this.deletePage = !this.deletePage;
        },
    },
});

const listClass = Vue.component('listClass',{
    template: `
    <div class="list">
        <input type="text" v-bind:value="className" v-on:input="handleInput" v-on:blur="changeListClass" v-on:focus="record" id="class-title">
        <ul>
            <li v-for="data in datas" class="list-class"  v-bind:id="data.locationUid" v-on:dblclick="getTargetId" v-on:click="changeLocation">
            <img class="item-photo" v-bind:src="data.photo[0]">
            <div>
                <div>{{data.name}} </div>
                <div class="location">{{data.location}}</div>
            </div>
            </li>
        </ul>
        <div class="delete-page" v-show="deletePage">
            <div class="background" v-on:click="toggleDeletePage"></div>
            <div class="delete-container">
                <div class="text">Are you sure to delete ?</div>
                <div class="delete-button">
                <button class="white-btn" v-on:click="toggleDeletePage">Cancel</button>
                <button class="button-class" v-on:click="deleteLocation">Confirm</button>
                </div>
            </div>
        </div>
        <div id="addEnt" v-show="formseen">
            <form v-on:submit.prevent="onFormChange">
                <div id=map-container>
                </div>
                <div id="location-mainrow">
                    <div id="location-message">
                        <input id="location-name" type="text" placeholder="Enter new location" v-model="name" v-bind:class="changing?'':'disable'" required>
                        <div id="location">{{location}}</div>
                    </div>
                    <div id="favourite" v-bind:class="changing?'':'disable'"><img src="./icon/star.svg" v-show="!favourite" v-on:click="handleStar"><img v-show="favourite" src="./icon/star_2.svg" v-on:click="handleStar"></div>
                </div>
                <div id="form-input">
                    <div class="select-class">
                        <span>Category</span>
                            <select class="input-class" v-model="selected" v-bind:class="changing?'':'disable'" required>
                                <option v-for="option in options" v-bind:value="option.classUid">
                                    {{option.name}}
                                </option>
                            </select>
                            <span id="triangle" v-show="changing"></span>
                    </div>
                    <div class="text-area-class"><span>Comment</span><textarea class="input-class" v-model="comment" v-bind:class="changing?'':'disable'"></textarea></div>
                    <div class="pictures">
                        <span>Pictures</span>
                        <div id="picture-row">
                            <div id="photo">
                                <img v-for="img in imgs"  class="img-class" v-bind:src="img" v-on:click="getDataURL" v-on:dblclick="deletePhoto">
                                <label id="add-photo" for="add-file" v-on:change="addFile" v-bind:class="changing?'':'disable'" v-show="changing">
                                    <img src="./icon/add-photo.svg">
                                    <input type="file" id="add-file">
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="line"></div>
                <div id="btn-row">
                    <button id="cancel" class="white-btn" type="button" v-on:click="formshowPage">CANCEL</button>
                    <div id="submit-row">
                    
                    <button id="sumbit-btn" class="button-class change-btn" type="button" v-show="nochange" v-on:click="gochange">EDIT</button>
                    <button class="button-class change-btn" type="submit" v-show="changing">CONFIRM</button>
                    </div>
                </div>
            </form>
            <div class="background""></div>
        </div>
        <div id="showPhoto" v-show="showPhotoPage">
            <img v-bind:src="showPhoto">
            <div class="background black"  v-on:click="handleShowPhoto"></div>
        </div>
        <div id="share-page" v-show="sharePage">
            <form v-on:submit.prevent="selectedMethod=='email'?sendEmail():useOtherMethod()">
                <div id="share-container">
                    <h3>Share through</h3>
                    <div id="email-method" >
                        <input type="radio" name="method" class="radio-class" id="email" value="email" v-model="selectedMethod" required>
                        <label for="email">Email</label>
                        <input type="email" class="input-class" id="email-address" placeholder="Send to..." v-model="emailAddress">
                    </div>
                    <div id="other-method" >
                        <input type="radio" name="method" class="radio-class" id="other" value="other" v-model="selectedMethod" required>
                        <label for="other">Other Methods</label>
                    </div>
                    <div class="line"></div>
                    <div id="share-btn-row">
                        <button class="white-btn" v-on:click="toggleSharePage" type="button">CANCEL</button>
                        <button class="button-class" type="submit">SHARE</button>
                    </div>
                </div>
            </form>
            <div class="background"></div>
        </div>
    </div>
    `,
    computed: {
        className(){
            return this.$store.state.listClass.find(data => data.classUid == this.$route.params.classId).name;
        },
        datas(){
            return this.$store.state.data.filter(data => data.class == this.$route.params.classId);
        },
        options(){
            return this.$store.state.listClass;
        }
    },
    data(){
        return {
            emailAddress: "",
            selectedMethod: "",
            sharePage: false,
            deletePage: false,
            timer: null,
            inputText: "",
            oldText: "",
            selectedId: "",
            nochange: true,
            changing: false,
            lat: null,
            long: null,
            formseen: "",
            location: "",
            name: "",
            selected: "",
            imgs: [],
            comment: "",
            showPhoto: "",
            showPhotoPage: false,
            favourite: false,
            index: null
        };
    },
    methods: {
        useOtherMethod(){
            let fileArray = [];
            for(i in this.imgs){
                fileArray.push(dataURLtoFile(this.imgs[i],'photo'+i));
            }
            if (navigator.canShare && navigator.canShare({ files: fileArray })) {//
                navigator.share({
                  title: 'Share photos',
                  text: 'Photos take form'+this.location,
                  files: fileArray
                })
                .then(() => this.sharePage = !this.sharePage)
                .catch((error) => alert('Sharing failed ' + error));
              }
            else
            {
                alert("Sorry, your browser does not support this function")
            }
        },
        sendEmail(){
            let imgTag = '';
            for(i in this.imgs){
                imgTag = imgTag.concat("<img src='" +this.imgs[i]+ "' width='200px'></img>");
            };
            window.location.href = 'mailto:'+this.emailAddress+'?suject=Location&body=Name: '+this.name+'<br>Location: '+this.location+'<br>Comment: '+this.comment+'<br>'+imgTag;
            this.sharePage = !this.sharePage
        },
        toggleSharePage(){
            this.sharePage = !this.sharePage;
        },
        gochange(){
            this.nochange = !this.nochange;
            this.changing = !this.changing;
        },
        handleShowPhoto(){
            this.showPhotoPage = !this.showPhotoPage;
        },
        changeLocation(e){
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                this.nochange = true;
                this.changing = false
                $('#map-container').html('<div id="map" style="width:100%;height:100%;margin:0;border-radius:5px 5px 0 0;"></div>');
                const targetLocation = this.datas[this.datas.map(x => x.locationUid).indexOf(parseInt(e.target.getAttribute("id")))];
                this.index = this.datas.map(x => x.locationUid).indexOf(parseInt(e.target.getAttribute("id")));
                this.name = targetLocation.name;
                this.location = targetLocation.location;
                this.favourite = targetLocation.favourite;
                this.comment = targetLocation.comment;
                this.selected = targetLocation.class;
                this.imgs = targetLocation.photo;
                this.formseen = !this.formseen;
                this.lat = targetLocation.lat;
                this.long = targetLocation.long;
                window.setTimeout(()=>{
                    var map;
                    map = L.map('map').setView([this.lat, this.long], 16.5);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                            maxZoom: 18,
                    }).addTo(map);
                    var marker = L.marker([this.lat, this.long]);
                    marker.addTo(map);
                },100)
            },200);
     
        },
        addFile(e){
            addPhoto(e).then(value => this.imgs.push(value));
        },
        formshowPage(){
            this.formseen = !this.formseen;
        },
        handleStar(){
            this.favourite = !this.favourite;
        },
        onFormChange(){
            const playload = {
                index: this.index,
                photo: this.imgs,
                name: this.name,
                location: this.location,
                comment: this.comment,
                class: this.selected,
                favourite: this.favourite,
            }
            this.$store.commit('changeLocation', playload);
            this.formseen = !this.formseen;
        },
        getDataURL(e){
            timers = this.timer;
            if(timers){
                window.clearTimeout(timers);
                this.timer=null;
            }
            this.timer = window.setTimeout(()=>{
                const dataURL = e.target.getAttribute("src");
                this.showPhoto = dataURL;
                this.showPhotoPage = !this.showPhotoPage;
            },200);
        },
        deletePhoto(e){
            if(this.changing){
                timers = this.timer
                if(timers){
                    window.clearTimeout(timers);
                    this.timer = null
                }
                
                this.imgs.splice(this.imgs.indexOf(e.target.getAttribute("src")),1);
            }
        },


        toggleDeletePage(){
            this.deletePage = !this.deletePage;
        },
        getTargetId(e){
            timers = this.timer
            if(timers){
                window.clearTimeout(timers);
                this.timer = null
            };
            this.selectedId = e.target.getAttribute("id");
            this.deletePage = !this.deletePage;
        },
        deleteLocation(){
            const playload = {
                index: this.datas.map(x => x.locationUid).indexOf(parseInt(this.selectedId))
            };
            if(playload.index == -1){
                alert('Unexpected error, please rty again');
            }
            else{
                vm.$store.commit('deleteLocation',playload);
            }
            this.deletePage = !this.deletePage;
        },
        record(e){
            this.inputText = "";
            if(e.target.value){
                this.oldText = e.target.value;
            }
        },
        handleInput(e){
            this.inputText = e.target.value;
            if(this.inputText != e.target.value){
                e.target.value = this.inputText;
            }
            this.$emit('input',this.inputText);
        },
        changeListClass(e){
            if(!this.inputText&&e.target.value){
            }
            else{
                if(!e.target.value){
                    this.inputText = this.oldText;
                    e.target.value = this.oldText;
                    alert("The input value cannot be empty");
                }
                else if(this.$store.state.listClass.some(x => x.name == e.target.value)){
                    this.inputText = this.oldText;
                    e.target.value = this.oldText;
                    alert("The input value cannot be repeated");
                }
                else{
                    const playload = {
                        index: this.$store.state.listClass.map(x => x.name).indexOf(this.oldText),
                        item: this.inputText,
                        };
                    this.$store.commit('changeClass',playload);
                }
            }
        }
    }
});

const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});//返回file
}
const addPhoto = (e)=>{
    const file = e.target.files[0];//取得file
    const reader = new FileReader();
    return new Promise ((resolve)=>{
        if(file){
            reader.readAsDataURL(file);
        };
        reader.addEventListener('load',()=>{
            const img = new Image()
            img.src = reader.result;
            img.addEventListener('load',()=>{
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const originW = img.width, originH = img.height, maxW = 600, maxH = 600;//壓縮圖片，防止體積太大
                let targetW = originW, targetH = originH;
                if(targetW > maxW || targetH > maxH){
                    if(originW / originH > maxW / maxH){
                        targetW = maxW;
                        targetH = Math.round(maxW * (originH / originW));
                    }
                    else{
                        targetH = maxH;
                        targetW = Math.round(maxH * (originW / originH));
                    }
                }
                canvas.width = targetW;
                canvas.height = targetH;
                context.clearRect(0, 0, targetW, targetH);
                context.drawImage(img, 0, 0, targetW, targetH);
                const newDataURL = canvas.toDataURL();
                resolve(newDataURL);//異步函數
            });
        });
    })
}
const notFound = Vue.component('notFound',{//404頁面
    template:`
    <div id="not-found-page">
        <h1>404 NOT FOUND</h1>
    </div>
    `
})
const store = new Vuex.Store({
    state: {
        data: JSON.parse(localStorage.getItem('data'))||[],
        listClass: JSON.parse(localStorage.getItem('listClass'))||[//預設category
            {
                name: 'Restaurant',
                classUid: 0
            },
            {
                name: 'Clothes',
                classUid: 1
            }
        ]
    },
    mutations: {
        changeClass(state,playload){
            state.listClass[playload.index].name = playload.item;
            localStorage.setItem('listClass',JSON.stringify(this.state.listClass));
        },
        deleteClass(state,playload){
            state.listClass.splice(playload.index,1);
            localStorage.setItem('listClass',JSON.stringify(this.state.listClass));
        },
        addClass(state,playload){
            state.listClass.push(playload);
            localStorage.setItem('listClass',JSON.stringify(this.state.listClass));
        },
        changeLocation(state,playload){//修改資料
            state.data[playload.index].name = playload.name;
            state.data[playload.index].favourite = playload.favourite;
            state.data[playload.index].comment = playload.comment;
            state.data[playload.index].class = playload.class;
            state.data[playload.index].photo = playload.photo;
            localStorage.setItem('data', JSON.stringify(this.state.data));
        },
        deleteLocation(state,playload){
            state.data.splice(playload.index,1)
            localStorage.setItem('data', JSON.stringify(this.state.data));
        },
        addEnt(state,playload){
            state.data.push(playload);
            localStorage.setItem('data', JSON.stringify(this.state.data));
        }
    }
});
const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            components: {
                default: listItem,
                addClass: addClass
            }
        
        },
        {
            path: '/all',
            name: 'all',
            component: listAll
        },
        {
            path: '/favourite',
            name: 'favourtite',
            component: listFavourite
        },
        {
            path: '/class/:classId',
            components: {
                default: listClass,
            },
        },
        {
            path: '*',
            component: notFound
        }
    ]
});
var vm = new Vue({
    el: '#app',
    router,
    store,    
    created(){
        // localStorage.clear();
        if(!window.localStorage){//判斷能否使用loclStorage
            alert('目前無法使用localStorage,請使用支持localStorage的瀏覽器');
        }
    },
});
