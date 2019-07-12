package com.olakeji.passenger.wechat.controller.busline;
import com.olakeji.passenger.wechat.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 通勤业务跳转相关
 */
@Controller
@RequestMapping(value = "/commutingBus")
public class CommutingBusController extends BaseController {
    /**
     * 跳转至通勤搜索页面
     * @return
     */
    @RequestMapping(value = "/searchLineResult")
    public String searchLineResult(@RequestParam(required = false) String distrib,@RequestParam(required = false)String lineId,
                                   @RequestParam(required = false)String departStationId,@RequestParam(required = false)String arriveStationId,
                                   @RequestParam(required = false)Integer departCityId,@RequestParam(required = false)String departAreaName,
                                   @RequestParam(required = false)String departLat,@RequestParam(required = false)String departLng,
                                   @RequestParam(required = false)Integer arriveAreaId,@RequestParam(required = false)String arriveAreaName,
                                   @RequestParam(required = false)String arriveLat,@RequestParam(required = false)String arriveLng,
                                   @RequestParam(required = false)String qrcId,
                                   Model model) {
        model.addAttribute("distrib",distrib);
        model.addAttribute("lineId",lineId);
        model.addAttribute("departStationId",departStationId);
        model.addAttribute("arriveStationId",arriveStationId);
        model.addAttribute("departCityId",departCityId);
        model.addAttribute("departAreaName",departAreaName);
        model.addAttribute("departLat",departLat);
        model.addAttribute("departLng",departLng);
        model.addAttribute("arriveAreaId",arriveAreaId);
        model.addAttribute("arriveAreaName",arriveAreaName);
        model.addAttribute("arriveLat",arriveLat);
        model.addAttribute("arriveLng",arriveLng);
        model.addAttribute("qrcId",qrcId);
        return "commut_searchLineResult";
    }

    /**
     * 班次详情
     * @return
     */
    @RequestMapping(value = "/shiftsDetail")
    public String shiftsDetail( @RequestParam(required = false,defaultValue = "0") String scheduleId,
                                @RequestParam(required = false,defaultValue = "0") String busId,
                               @RequestParam(required = false,defaultValue = "0")Integer departStationId,
                               @RequestParam(required = false,defaultValue = "0")Integer arriveStationId, Model model ) {
        model.addAttribute("scheduleId",scheduleId);
        model.addAttribute("busId",busId);
        model.addAttribute("departStationId",departStationId);
        model.addAttribute("arriveStationId",arriveStationId);
        return "commut_shiftsDetail";
    }
    /**
     * 选择日期
     * @return
     */
    @RequestMapping(value = "/chooseDate")
    public String chooseDate(String scheduleId, String startStationId, String endStationId, String departDate, Model model) {
        model.addAttribute("scheduleId",scheduleId);
        model.addAttribute("startStationId",startStationId);
        model.addAttribute("endStationId",endStationId);
        model.addAttribute("departDate",departDate);
        return "commut_chooseDate";
    }

    /**
     * 下单页面
     * @return
     */
    @RequestMapping(value = "/toAddOrder")
    public String toAddOrder(Model model ) {
        return "commut_toAddOrder";
    }

    /**
     * 验票
     * @return
     */
    @RequestMapping(value = "/checkTicket")
    public String checkTicket(String orderNo,String busId,Model model) {
        model.addAttribute("orderNo",orderNo);
        model.addAttribute("busId",busId);
        return "commut_checkTicket";
    }

    /**
     * 行程详情
     * @return
     */
    @RequestMapping(value = "/lineMap")
    public String lineMap(String orderNo, String departDate, Model model) {
        model.addAttribute("orderNo", orderNo);
        model.addAttribute("departDate", departDate);
        return "commut_lineMap";
    }
}
