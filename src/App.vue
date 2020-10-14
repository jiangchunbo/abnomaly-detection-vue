<template>
    <div class="layout">
        <div class="layout-left">
            <div class="left-container">
                <div class="container-title">实时监控</div>
                <div class="container-content">
                    <div class="item-drop">
                        <select class="left-drop">
                            <option>所有监控</option>
                        </select>
                    </div>
                    <div class="left-list">
                        <div
                            class="left-list-item-wrapper"
                            v-for="(value, key, index) in mediaDataSources"
                            :key="index"
                        >
                            <video :id="key" muted controls />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="layout-center">
            <div class="center-container">
                <div class="center-container-title">
                    <span>视频流检测</span>
                </div>
                <div class="center-container-circle"></div>

                <div
                    class="center-container-content"
                    id="center-container-content"
                >
                    <img :src="subjectImg" alt="" id="center-subject-img" />
                </div>

                <div
                    class="center-container-background"
                    id="center-container-background"
                ></div>
            </div>
        </div>

        <div class="layout-right">
            <div class="right-container">
                <div class="container-title">异常上报</div>
                <div class="container-content">
                    <div class="item-drop">
                        <select class="right-drop">
                            <option>所有错误</option>
                        </select>
                    </div>
                    <div class="right-list">
                        <div
                            class="right-list-item-wrapper"
                            v-for="(item, index) in anomalyImg"
                            :key="index"
                        >
                            <div class="right-list-item">
                                {{ item.cls }} {{ item.score }}
                            </div>
                            <img
                                :src="`data:image/jpeg;base64,${item.img}`"
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import flv from "flv.js";
import { mediaDataSource } from "@/data/mediaDataSource";
import request from "@/utils/request";
import loading from "@/assets/loading.gif";
// import {imguri} from "@/config";
// import request from "@/utils/request";

export default {
    data() {
        return {
            mediaDataSources: {},
            anomalyImg: [],
            websocket: null,
            subjectImg: loading,
            timer: null,
        };
    },

    mounted() {
        this.initWebSocket();
        this.timer = setInterval(this.fetchAnomalyImg, 1000 * 60 * 5);
        this.anomalyImg = this.fetchAnomalyImg();
        this.mediaDataSources = mediaDataSource;
        this.$nextTick(() => {
            if (flv.isSupported()) {
                for (const key in this.mediaDataSources) {
                    this.loadMediaSource(key, this.mediaDataSources[key]);
                }
            }
        });

        const bg = document.getElementById("center-container-background");
        const content = document.getElementById("center-container-content");
        const img = document.getElementById("center-subject-img");
        const screenWidth = window.screen.width;
        const centerWidth = screenWidth - 256 - 256;
        img.style.width = centerWidth * 0.77 + "px";
        bg.style.width = centerWidth * 0.8 + "px";
        content.style.width = centerWidth * 0.8 + "px";
        bg.style.height = (centerWidth * 0.8 * 447) / 658 + "px";
        content.style.height = (centerWidth * 0.8 * 447) / 658 + "px";
    },

    beforeDestroy() {
        this.mediaDataSources.forEach((item) => {
            item.player.destroy();
        });
        clearInterval(this.timer);
    },
    methods: {
        initWebSocket() {
            this.createSubjectImgWebSocket();
            this.websocket.onopen = () => {
                console.log("打开");
            };

            this.websocket.onerror = () => {
                console.log("错误");
            };

            this.websocket.onclose = () => {
                console.log("关闭");
                setTimeout(() => {
                    this.createSubjectImgWebSocket();
                }, 1000 * 60);
            };
        },

        createSubjectImgWebSocket() {
            this.websocket = new WebSocket("ws://221.226.81.54:39999");
            this.websocket.onmessage = (message) => {
                this.subjectImg = "data:image/jpeg;base64," + message.data;
            };
        },

        fetchAnomalyImg() {
            request({
                url: "/get_abnormal_meta/",
                method: "post",
            }).then((response) => {
                /* 获取到信息 */
                const { data } = response;
                this.anomalyImg = data;
            });
        },

        loadMediaSource(key, value) {
            let video = document.getElementById(key);
            video.addEventListener("play", () => {
                if (isNaN(value.player.duration)) {
                    value.player = flv.createPlayer({
                        type: "flv",
                        isLive: true,
                        url: `ws://221.226.81.54:39999/rtsp?url=${value.rtsp}`,
                    });
                    value.player.attachMediaElement(video);
                    value.player.load();
                }
            });

            if (video) {
                value.player = flv.createPlayer({
                    type: "flv",
                    isLive: true,
                    url: `ws://221.226.81.54:39999/rtsp?url=${value.rtsp}`,
                });
                value.player.attachMediaElement(video);
                value.player.load();
            }
        },
    },
};
</script>
<style lang="scss">
$layout-left-width: 256px;
$left-container-width: 256px;
$left-container-top: 10px;
$left-container-bottom: 10px;
$left-container-header-height: 50px;
$left-container-content-width: 238px;
$left-container-content-bottom: 10px;
$left-container-drop-top: 20px;
$left-container-drop-height: 36px;

$center-container-width: 100%;
$center-container-height: 100%;
$center-container-header-width: 459px;
$center-container-header-height: 72px;
$center-container-header-top: 50px;
$center-container-main-width: 1000px;
$center-container-main-height: 426px;
$center-container-main-top: 40px;
$center-container-main-left: 20px;
$center-container-main-right: 20px;

$layout-right-width: 256px;
$right-container-width: 256px;
$right-container-top: 10px;
$right-container-bottom: 10px;
$right-container-header-height: 50px;
$right-container-content-width: 238px;
$right-container-content-bottom: 10px;
$right-container-drop-top: 20px;
$right-container-drop-height: 36px;

$item-border-color: #96faff;

html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

.layout {
    width: 100%;
    height: 100%;
    background: #0e293e;
}

.layout-left {
    box-sizing: border-box;
    height: 100%;
    width: $layout-left-width;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
}

.layout-right {
    height: 100%;
    width: $layout-right-width;
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    z-index: 2;
}

.layout-center {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    margin-left: $layout-left-width;
    margin-right: $layout-right-width;
    z-index: 1;
}

.left-container {
    box-sizing: border-box;
    width: $left-container-width;
    position: absolute;
    left: ($layout-left-width - $left-container-width) / 2;
    top: $left-container-top;
    bottom: $left-container-bottom;
}

.right-container {
    box-sizing: border-box;
    width: $right-container-width;
    position: absolute;
    right: ($layout-right-width - $right-container-width) / 2;
    top: $right-container-top;
    bottom: $right-container-bottom;
}

.center-container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    .center-container-title {
        text-align: center;
        width: $center-container-header-width;
        height: $center-container-header-height;
        line-height: $center-container-header-height;
        color: white;
        font-size: 28px;
        position: absolute;
        top: 10px;
        right: 0;
        left: 0;
        margin: auto;
        z-index: 1;
        background-image: url("~@/assets/视频流检测背景.png");
        background-repeat: no-repeat;
    }

    .center-container-circle {
        position: absolute;
        top: 0;
        bottom: 0;
        left: -$left-container-width;
        right: -$left-container-width;
        margin: auto;
        background: url("~@/assets/中心圆.png") no-repeat;
        background-size: cover;
        z-index: 0;
    }

    .center-container-content {
        background-image: url("~@/assets/主题图背景.png");
        background-size: cover;
        z-index: 999;
        background-repeat: no-repeat;
        margin: auto;
        position: absolute;
        top: $center-container-header-height + 10px;
        bottom: 0;
        left: 0;
        right: 0;

        img {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            /*max-width: 658px;*/
            /*max-height: 382px;*/
            margin: auto;
            z-index: 2;
            border: 1px solid rgba(150, 250, 255, 0.5);
        }
    }
}

.container-title {
    text-align: center;
    height: $left-container-header-height;
    line-height: $left-container-header-height;
    color: white;
    font-size: 28px;
}

.container-content {
    position: absolute;
    top: $left-container-header-height;
    bottom: 0;
    left: 0;
    right: 0;

    background: url("~@/assets/实时监控框.png") no-repeat;
    background-size: 100% 100%;

    .left-drop {
        width: $left-container-content-width;
        box-sizing: border-box;
        position: absolute;
        left: ($left-container-width - $left-container-content-width) / 2;
        right: ($left-container-width - $left-container-content-width) / 2;
        top: $left-container-drop-top;
        background-color: #2a5365;
        font-size: 16px;
        padding: 3px;
        border: 2px solid $item-border-color;
        color: $item-border-color;
        height: $left-container-drop-height;
    }

    .left-list {
        overflow: auto;
        position: absolute;
        width: $left-container-content-width;
        top: $left-container-drop-height + $left-container-drop-top;
        bottom: $left-container-content-bottom;
        left: ($left-container-width - $left-container-content-width) / 2;
        right: ($left-container-width - $left-container-content-width) / 2;
    }
}

.right-drop {
    width: $right-container-content-width;

    position: absolute;
    left: ($right-container-width - $right-container-content-width) / 2;
    right: ($right-container-width - $right-container-content-width) / 2;
    top: $right-container-drop-top;
    background-color: #2a5365;
    font-size: 16px;
    padding: 3px;
    border: 2px solid $item-border-color;
    color: $item-border-color;
    height: $right-container-drop-height;
}

.right-list {
    overflow: auto;
    position: absolute;
    top: $right-container-drop-top + $right-container-drop-height;
    bottom: $right-container-content-bottom;
    left: ($right-container-width - $right-container-content-width) / 2;
    right: ($right-container-width - $right-container-content-width) / 2;
}

.left-list-item-wrapper {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 2px 8px 0;
    padding: 2px;
    background: linear-gradient(to left, $item-border-color, $item-border-color)
            left top no-repeat,
        linear-gradient(to bottom, $item-border-color, $item-border-color) left
            top no-repeat,
        linear-gradient(to left, $item-border-color, $item-border-color) right
            top no-repeat,
        linear-gradient(to bottom, $item-border-color, $item-border-color) right
            top no-repeat,
        linear-gradient(to left, $item-border-color, $item-border-color) left
            bottom no-repeat,
        linear-gradient(to bottom, $item-border-color, $item-border-color) left
            bottom no-repeat,
        linear-gradient(to left, $item-border-color, $item-border-color) right
            bottom no-repeat,
        linear-gradient(to left, $item-border-color, $item-border-color) right
            bottom no-repeat;
    /*设置大小*/
    background-size: 2px 10px, 20px 2px;

    video {
        width: 100%;
        border: 1px solid rgba(150, 250, 255, 0.5);
    }
}

.right-list-item-wrapper {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 2px 0;
    padding: 2px;
    border: 2px solid $item-border-color;

    .right-list-item {
        color: $item-border-color;
    }

    img {
        width: 100%;
    }
}
</style>
