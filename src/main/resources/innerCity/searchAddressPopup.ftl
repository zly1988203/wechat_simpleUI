<!--查询地址-->
<div id="search-address" class="sui-popup-container">
    <div class="sui-popup-mask"></div>
    <div class="sui-popup-modal">
        <div class="search-bar">
            <div class="search-bar-inner">
                <div class="tools-control">
                    <div class="serach-input">
                        <input type="text" id="textSearchMap" placeholder="区域名称/地址" />
                    </div>
                </div>


                <button id="sarchCancelbtn"  type="button"  class="cancel">取消</button>
                <button id="closePanelBtn" type="button" class="cancel">关闭</button>
            </div>
        </div>


        <div id="searchWrapper" class="wrapper">
            <div class="content">

                <ul id="mapResult" class="sui-list sui-border-tb">
                </ul>

                <div id="adrsResult" class="gather">
                    <!-- 当前位置 -->
                    <div class="current" style="display: none">
                        <span class="title">当前位置</span>
                        <div class="station-group">
                            <!--<span class="loc_address">深圳南山</span>-->
                        </div>
                    </div>

                    <!-- 历史记录 -->
                    <div class="history" style="display: none">

                    </div>

                    <div class="b-line" style="display: none"></div>
                    <!-- 地区推荐 -->
                    <div class="recommend" style="display: none">
                        <span class="title">已开通区域</span>
                        <div class="area-list">

                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>
</div>