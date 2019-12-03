
<% for(var i in list.aLoupanList){ var $d = list.aLoupanList[i]%>
<div class="list-box">
    <a class="recommended_list clearfix" href="<%= $d.url%>">
        <div class="pic_box <% if($d.picUrl){ %> <% }else{ %> noimg <% } %>">
            <img src="<%= $d.picUrl %>" alt="<%= $d.title %>" alt="" />
        </div>
        <div class="lp_info">
            <div class="lp_info_top">
                <h2 class="lp_name">
                    <p><%= $d.title %></p>
                    <% if($d.salesState != 0) {%>
                    <small class="salestate_<%= $d.salesState %>"><%= $d.salesStateName %></small>
                    <% } %>
                </h2>
                <div class="lp_item clearfix">
                    <span><%=$d['region']%></span>&nbsp;·&nbsp;
                    <span><%=$d['estateType']%></span>
                </div>
                <div class="lp_label clearfix">
                    <% if($d.tags.length) {%>
                        <% for(var j=0; j<$d.tags.length; j++){ %>
                            <% if(j<3) {%>
                            <span><%=$d.tags[j].substr(0,4) %></span>
                            <% }%>
                        <% }%>
                    <% }%>

                </div>
                <div class="lp_price clearfix">
                    <%=$d.unitPrice%>
                    <span><%=$d.area%></span>
                </div> 
            </div>
        </div>
    </a>
</div>
<% } %>
