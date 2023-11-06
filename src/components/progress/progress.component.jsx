import React, { useEffect, useState } from "react";
import { TinyArea } from '@ant-design/plots';
import { Typography, Space, Image, Badge, Button, Row, Col, Statistic, Skeleton,Card} from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import  card  from "../../images/cards.png";
import { MOCK_CONFIGURE, MOCK_DATA } from "../../const";
import "./styles.css";
import overall_progress from "../../images/progress.png";
import { Sparklines, SparklinesLine } from 'react-sparklines';
 
var previous_check_in_date;
var lastcheckin;
var col_overall_progress;

var current_user_email ;
const { Text, Link, Title } = Typography;

const DemoTinyArea =  (difference_progress) => {

  var kf = window.kf;
  var data_api;
  var dataarray;
  
  current_user_email= kf.user.Email;

  
  const [data, setData] = useState([]);


// useEffect(() => {
//   kf.context.watchParams(async function (watch) {
//     let area_graph = watch.area_graph;
//     console.log("REACT ", area_graph);
//     asyncFetch();
//   });
// });

useEffect(() => {
  kf.context.watchParams(async function (watch) {
    let area_graph = watch.area_graph;
    console.log("REACT ", area_graph);
    asyncFetch();
  });
},[]);

const asyncFetch = async () => {

  kf = window.kf;
  var overall_data_form_id = await kf.app.getVariable("overall_data_form_id");
  var overall_data_form_name = "Overall Progress";
  if (!overall_data_form_id) {
    await kf.api("/flow/2/" + kf.account._id + "/form/?_application_id=" + kf.app._id).then(async (form_report) => {
      console.log('process data', form_report);
      var data_form_info = form_report.find(itm => itm.Name === overall_data_form_name);
      overall_data_form_id = data_form_info._id;
      console.log("dataform name", overall_data_form_name);
      console.log("dataform id =", overall_data_form_id);
    });
    kf.app.setVariable("overall_data_form_id", overall_data_form_id);

  }

    var overall_team_okr_status_marker_id;
    let overall_team_okr_status_marker_name = "Overall Progress Team";
    var overall_my_okr_status_marker_id;
    let overall_my_okr_status_marker_name = "Overall_Progress";
    var overall_company_okr_status_marker_id;
    let overall_company_okr_status_marker_name = "Overall Progress Company";

    if (!overall_team_okr_status_marker_id ||!overall_my_okr_status_marker_id  || !overall_company_okr_status_marker_id) {
      await kf.api("/flow/2/" + kf.account._id + "/form/" + overall_data_form_id + "/report?_application_id=" + kf.app._id).then((report_list) => {
        if (!overall_team_okr_status_marker_id) {
          let report_info = report_list.find(itm => itm.Name === overall_team_okr_status_marker_name);
          overall_team_okr_status_marker_id = report_info._id;
          console.log("report_info =", overall_team_okr_status_marker_id);
          kf.app.setVariable("overall_team_okr_status_marker_id", overall_team_okr_status_marker_id);
        } 

        if (!overall_my_okr_status_marker_id) {
          let report_info = report_list.find(itm => itm.Name === overall_my_okr_status_marker_name);
          overall_my_okr_status_marker_id = report_info._id;
          console.log("report_info =", overall_my_okr_status_marker_id);
          kf.app.setVariable("overall_my_okr_status_marker_id", overall_my_okr_status_marker_id);
        }

        if (!overall_company_okr_status_marker_id) {
          let report_info = report_list.find(itm => itm.Name === overall_company_okr_status_marker_name);
          overall_company_okr_status_marker_id = report_info._id;
          console.log("report_info =", overall_company_okr_status_marker_id);
          kf.app.setVariable("overall_company_okr_status_marker_id", overall_company_okr_status_marker_id);
        }
  
     
      });
    }
  var page_id = kf.page._id;



  if ( page_id  == "role_executive_api_customisation_A00" ) {
  kf.api("/form-report/2/"+kf.account._id+"/"+overall_data_form_id+"/"+overall_my_okr_status_marker_id+"?_application_id="+kf.app._id+"&$objective_owner_email="+current_user_email)
  .then((result) => {
   
   data_api = result;
    console.log("data_api_1", data_api);
    for (let j in data_api.Columns) {
      let colval = data_api.Columns[j];
      if (colval.FieldId == "Overall_Progress_Number") {
        col_overall_progress = colval.Id;
       console.log("col_overall_progress", col_overall_progress);
      }
  }
   dataarray = data_api.Data.map((item) => item[col_overall_progress]);
   let dataarray = data_api.Data.map((item) => item[col_overall_progress]);
   console.log("dataarray_team", dataarray);
   dataarray = [...dataarray].reverse(); // Create a reversed copy of dataarray
   console.log("dataarray_team_reverse", dataarray);
   setData(dataarray);

  })

  }

  else if ( page_id == "Company_OKR_page_A00") {
    kf.api("/form-report/2/"+kf.account._id+"/"+overall_data_form_id+"/"+overall_company_okr_status_marker_id+"?_application_id="+kf.app._id)
    .then((result) => {
     
     data_api = result;
      console.log("data_api_1", data_api);
      for (let j in data_api.Columns) {
        let colval = data_api.Columns[j];
        if (colval.FieldId == "Overall_Progress_Number") {
          col_overall_progress = colval.Id;
         console.log("col_overall_progress", col_overall_progress);
        }
    }
     dataarray = data_api.Data.map((item) => item[col_overall_progress]);

     let dataarray = data_api.Data.map((item) => item[col_overall_progress]);
     console.log("dataarray_team", dataarray);
     dataarray = [...dataarray].reverse(); // Create a reversed copy of dataarray
     console.log("dataarray_team_reverse", dataarray);
     setData(dataarray);
    })
  
    }

    else if ( page_id == "Copy_Team_OKR_Page_A00"  ) {


      kf.app.getVariable("Team_OKR_Team_Name").then(team_okr_current_tab =>    kf.api("/form-report/2/"+kf.account._id+"/"+overall_data_form_id+"/"+overall_team_okr_status_marker_id+"?_application_id="+kf.app._id+"&$team_name="+team_okr_current_tab)
      .then((result) => {
       
       data_api = result;
        console.log("data_api_1", data_api);
        for (let j in data_api.Columns) {
          let colval = data_api.Columns[j];
          if (colval.FieldId == "Overall_Progress_Number") {
            col_overall_progress = colval.Id;
           console.log("col_overall_progress", col_overall_progress);
          }
      }
      let dataarray = data_api.Data.map((item) => item[col_overall_progress]);
      console.log("dataarray_team", dataarray);
      dataarray = [...dataarray].reverse(); // Create a reversed copy of dataarray
      console.log("dataarray_team_reverse", dataarray);
      setData(dataarray);
      
    
      }))

   
    
      }
  
};

//asyncFetch();
 
     
     //const data = [97.4,92.1,81.6,71.1,97.4]
     console.log("datadata_2", data);

     // Calculate the difference between the last two values in the data array
     const lastValue = data[data.length - 1];
     const secondToLastValue = data[data.length - 2];
     const difference = lastValue - secondToLastValue;
     
     // Determine the fill color for areaStyle based on the difference
     const lineColor = difference > 0 ? '#4AA147' : '#d95158';
     const fillColor = difference > 0 ? 'l(270) 0:#ffffff 0.5:#4AA147 1:#4AA147' : 'l(270) 0:#ffffff 0.5:#d95158 1:#d95158';
     
     const config = {
       height: 60,
       width: 80,
       autoFit: false,
       data,
       smooth: true,
       areaStyle: {
         fill: fillColor, // Set the fill color based on the condition
         fillOpacity: 0.4,
       },
       line: { color: lineColor }
     }
     
     
       console.log("datadata_3",data)
       return <TinyArea {...config} />;
  
       
   

 
  
};

const getColor = {
  "Not Started": "#AFB7C7",
  "At Risk": "#F58220",
  "Behind": "#DF4440",
  "On Track": "#03ADF3",
  Completed: "#4AA147",
  Dropped: "#27279E",
};

const allStatusValues = [
  "Not Started",
  "At Risk",
  "On Track",
  "Behind",
  "Dropped",
  "Completed",
];

const Bars = ({ configure, data = [] }) => {
  // Filter out items with a count greater than zero
  const filteredData = data.filter((item) => item[configure.valueId] > 0);

  if (filteredData.length === 0) {
    // No items with count greater than zero, render a 100% progress bar in #F0F3F7
    return (
      <div className="bars" style={{ display: "flex" }}>
        <div
          className="bar"
          style={{
            backgroundColor: "#F0F3F7",
            width: "100%",
          }}
        />
      </div>
    );
  }


  const total = filteredData.reduce((sum, item) => sum + item[configure.valueId], 0);

  return (
    <div className="bars" style={{ display: "flex" }}>
      {filteredData.map((item, i) => {
        const status = item[configure.rowId];
        const count = item[configure.valueId];
        const width = (count / total) * 100 + "%";

        return (
          <div
            className="bar"
            style={{
              backgroundColor: getColor[status] || "#CCCCCC",
              width,
            }}
            key={i}
          />
        );
      })}
    </div>
  );
};

const getStatusCount = (data, configure) => {
  const statusCounts = {};

  data.forEach((item) => {
    const status = item[configure.rowId];
    const count = item[configure.valueId];
    statusCounts[status] = count;
  });

  return statusCounts;
};




const ProgressComponent = () => {
  var kf = window.kf;

  current_user_email= kf.user.Email;
//Column_ObPmWP7E7i
  const [progressData, setProgressData] = useState(null); // Initialize progressData as null
  const [configure, setConfigure] = useState({ rowId: "", valueId: "" });
  const [LastCheckinDate, setLastCheckinDate] = useState(null);
  const [successPercent, setSuccessPercent] = useState(0);
  const [difference_progress, setDifferenceProgress] = useState(0);
  const [progressStatusMarker, setprogressStatus] = useState(null);
  const [PreviousCheckinDate, setpreviouscheckinDate] = useState(null);
  //const [team_okr_tab_change, setTeamName] = useState("");
 
  useEffect(() => {
    
    kf.context.watchParams(async function (watch) {
      let progressStatusMarker = watch.progress_status_marker;
      console.log("REACT status wise progress", progressStatusMarker);
      setprogressStatus(progressStatusMarker);
      let overallProgress = watch.Overall_Progress;
      console.log("REACT OVERALL", overallProgress);
      overallProgress = Math.round(overallProgress);
      setSuccessPercent(overallProgress);
      var difference_over_all_progress = watch.difference_over_all_progress;
      setDifferenceProgress(difference_over_all_progress);
      // setTeamName(team_okr_tab_change);
      var lastcheckin = watch.last_check_in_date;
      if (LastCheckinDate !== "date") {
        previous_check_in_date = lastcheckin;
        setpreviouscheckinDate(previous_check_in_date);
        console.log("previous_check_in_date", previous_check_in_date)
      }
      let var_lastcheckin = await kf.app.getVariable("last_check_in_date")
      let team_okr_tab_change = watch.team_okr_tab_change;
      console.log("team_okr_tab_change", team_okr_tab_change)
      console.log("lastcheckin", lastcheckin)
      console.log("var_lastcheckin", var_lastcheckin)
      setLastCheckinDate(lastcheckin);
      getProgressData();
      DemoTinyArea(difference_over_all_progress);
 
    });
  
  }, []);
  



//   useEffect(() => {
//     kf.context.watchParams(async function (watch) {
//       let team_okr_tab_change = watch.team_okr_tab_change;
//       console.log("team_okr_tab_change",team_okr_tab_change)
//         getProgressData();
//     });


// }, []);



  // useEffect(() => {
  //   // Fetch progress data when progressStatusMarker changes
  //   if (progressStatusMarker !== null) {
  //     getProgressData();
      
  //   }
  // }, [progressStatusMarker]);

  async function getProgressData() {
    console.log(kf, "kf sdk data");
    let { _id: accountId } = kf?.account;
    let page_id = kf.app.page._id;

    let application_id = kf.app._id;
    var account_id = kf.account._id;
    let data;
    console.log("page_id",page_id)

      
  var objective_data_form_id = await kf.app.getVariable("objective_data_form_id");
  var objective_data_form_name = "Objective Master";
  if (!objective_data_form_id) {
    await kf.api("/flow/2/" + kf.account._id + "/form/?_application_id=" + kf.app._id).then(async (form_report) => {
      console.log('process data', form_report);
      var data_form_info = form_report.find(itm => itm.Name === objective_data_form_name);
      objective_data_form_id = data_form_info._id;
      console.log("dataform name", objective_data_form_name);
      console.log("dataform id =", objective_data_form_id);
    });
    kf.app.setVariable("objective_data_form_id", objective_data_form_id);

  }

    var team_okr_status_marker_id;
    let team_okr_status_marker_name = "Team OKR - Status Marker";
    var my_okr_status_marker_id;
    let my_okr_status_marker_name = "Active OKR - Status Marker";
    var company_okr_status_marker_id;
    let company_okr_status_marker_name = "Company OKR - Status Marker";

    if (!team_okr_status_marker_id ||!my_okr_status_marker_id  || !company_okr_status_marker_id) {
      await kf.api("/flow/2/" + kf.account._id + "/form/" + objective_data_form_id + "/report?_application_id=" + kf.app._id).then((report_list) => {
        if (!team_okr_status_marker_id) {
          let report_info = report_list.find(itm => itm.Name === team_okr_status_marker_name);
          team_okr_status_marker_id = report_info._id;
          console.log("report_info =", team_okr_status_marker_id);
          kf.app.setVariable("team_okr_status_marker_id", team_okr_status_marker_id);
        } 

        if (!my_okr_status_marker_id) {
          let report_info = report_list.find(itm => itm.Name === my_okr_status_marker_name);
          my_okr_status_marker_id = report_info._id;
          console.log("report_info =", my_okr_status_marker_id);
          kf.app.setVariable("my_okr_status_marker_id", my_okr_status_marker_id);
        }

        if (!company_okr_status_marker_id) {
          let report_info = report_list.find(itm => itm.Name === company_okr_status_marker_name);
          company_okr_status_marker_id = report_info._id;
          console.log("report_info =", company_okr_status_marker_id);
          kf.app.setVariable("company_okr_status_marker_id", company_okr_status_marker_id);
        }
  
     
      });
    }


    if (page_id == "role_executive_api_customisation_A00") {
      data = await kf.api(
        `/form-report/2/${accountId}/${objective_data_form_id}/${my_okr_status_marker_id}?_application_id=`+kf.app._id+`&$objective_owner_email=`+current_user_email+`&page_number=1&page_size=1000`
      );
      console.log("my okr page - progress", data);
    } else if (page_id == "Company_OKR_page_A00") {
      data = await kf.api(
        `/form-report/2/${accountId}/${objective_data_form_id}/${company_okr_status_marker_id}?_application_id=`+kf.app._id+`&page_number=1&page_size=1000`
      );
      console.log("company okr page - progress", data);
    }

    else if (page_id == "Copy_Team_OKR_Page_A00" ) {
        let team_okr_current_tab = await kf.app.getVariable("Team_OKR_Team_Name")
      console.log("team_okr_current_tab",team_okr_current_tab)
      data = await kf.api(
        `/form-report/2/${accountId}/${objective_data_form_id}/${team_okr_status_marker_id}?_application_id=`+kf.app._id+`&$team_name=`+team_okr_current_tab+`&page_number=1&page_size=1000`
      );
      console.log("DIFFERENCE", data);


    }

    let progressStatusData = data.Data;

    let rowsStatusMarker;
    let valuesStatusMarker;

    for (let j in data.Rows) {
      let rowval = data.Rows[j];

      if (rowval.FieldId === "Status_Marker_text") {
        rowsStatusMarker = rowval.Id;
      }
    }

    for (let j in data.Values) {
      let rowval = data.Values[j];

      if (rowval.FieldId === "Objective_ID") {
        valuesStatusMarker = rowval.Id;
      }
    }

    console.log(data, "kf progress data");
    setProgressData(progressStatusData);
    console.log("rowsStatusMarker",rowsStatusMarker)
    console.log("valuesStatusMarker",valuesStatusMarker)
    
    setConfigure({ rowId: rowsStatusMarker, valueId: valuesStatusMarker });
  }

  // Initialize sortedProgressData as an empty array when progressData is null
  const sortedProgressData = progressData
    ? allStatusValues.map((status) => {
        const item = progressData.find((dataItem) => dataItem[configure.rowId] === status);
        return item || { [configure.rowId]: status, [configure.valueId]: 0 };
      })
    : [];
console.log("sortedProgressData",sortedProgressData)
    // const leftCardSkeleton = (
    //   <div style={{ margin: "5px" }}>
    //   <Card style={{ borderColor: "#D8DCE5", borderRadius: "8px", borderStyle: "solid", margin: "5px" }}>
    //     <Skeleton.Image style={{ margin: "5px"  ,width: '10px', height: '18px' }} />
    //     <Skeleton title={{ margin: "5px"  ,width: '40%' }} paragraph={{margin: "5px"  , rows: 2 }} />
    //     <Skeleton paragraph={{ margin: "5px"  ,rows: 1 }} />
    //   </Card>
    //   </div>
    // );
  
    // // Skeleton for the right Card
    // const rightCardSkeleton = (

    //   <div style={{ margin: "5px" }}>
    //   <Card style={{  borderColor: "#D8DCE5", borderRadius: "8px", borderStyle: "solid", margin: "5px" }}>
    //     <Skeleton.Image style={{ margin: "5px"  , width: '18px', height: '18px' }} />
    //     <Skeleton title={{ margin: "5px"  ,width: '60%' }} paragraph={{ margin: "5px"  , rows: 2 }} />
    //     <Skeleton paragraph={{ margin: "5px"  ,rows: 1 }} />
    //   </Card>
    //   </div>
    // );
  // Check if progressData is available before rendering
  if (!progressData) {
    return (
      <Row gutter={8} style={{ backgroundColor: "#F1F3F7" }}>
      <Col span={7}>
        <div style={{ backgroundColor: "white", borderColor: "#D8DCE5", borderRadius: "8px", borderStyle: "solid", margin: "5px", width: "100%", height: "140px" }}>
          <Skeleton active />
        </div>
      </Col>
      <Col span={17}>
        <div style={{ backgroundColor: "white", borderColor: "#D8DCE5", borderRadius: "8px", borderStyle: "solid", margin: "5px", width: "100%", height: "140px" }}>
          <Skeleton active />
        </div>
      </Col>
    </Row>
    
    




 
    );
  }

  // Render the component once progressData is available
  return (

    <>

    <Row>
 

    <Col className="gutter-row" span={5}>
        <Card style={{borderColor: "#D8DCE5", borderRadius: "8px", borderStyle: "solid", margin: "5px"}}
        title={<><Space><Image preview={false} width={18} height={18} src={overall_progress}/>
        <Title style={{marginTop:"13px",fontFamily:"Inter",fontSize:"16px",fontWeight:"600"}}   level={5}>Overall progress</Title></Space></>}>
       
      
     <Row wrap={true}>
      <Col  align='start' flex="auto">
        <Space>
     <Title style={{marginLeft:"25px",marginTop:"7px",fontFamily:"Inter",fontSize:"30px",fontWeight:"600"}}   level={1}>{successPercent}%</Title>
     <Statistic
  value={difference_progress}
  precision={1}
  valueStyle={{
    marginLeft: "10px",
    color: difference_progress == 0 ? "#000000E0" : "#ffff",
    background: difference_progress == 0 ? "#F0F3F7" : difference_progress < 0 ? "#d95158" : "#4AA147",
    fontFamily: "Inter",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "4px",
  }}
  prefix={difference_progress < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
  suffix="%"  
/>


        </Space>
         </Col>
         <Col align="end" flex="auto">
         <DemoTinyArea />
         
        </Col> 
        
       
        </Row>

        <Row align="start">
          <Text style={{ marginLeft: "25px", fontFamily: "Inter", fontSize: "12px", fontWeight: "500", color: "#717D91" }}>
          {LastCheckinDate ? `Last Updated ${LastCheckinDate}` : PreviousCheckinDate ? `Last Updated ${PreviousCheckinDate}` : ''}
            </Text>
        </Row>

        </Card>
      </Col>




     
      
      
      <Col className="gutter-row" span={19}>
   
   <Card style={{borderColor: "#D8DCE5", borderRadius: "8px", borderStyle: "solid", margin: "5px"}}
         title={<><Space><Image  preview={false}  width={18} height={18} src={card}/>
         <Title style={{marginTop:"13px", fontFamily:"Inter",fontSize:"16px",fontWeight:"600"}}   level={5}>Progress by status</Title></Space></>}>
    
       
      <div className="multicolourBar">
              <div className="multicolor-bar" style={{ marginLeft: "15px" }}>
                <Bars configure={configure} data={sortedProgressData} />
              </div>
            </div>
       
       <Space style={{marginTop:"10px", marginBottom: "11px",marginLeft:"15px"}} size={"large"} wrap>
       {/* <div className="statusButton" style={{ marginLeft: "20px" }}> */}
       {allStatusValues.map((status) => {
const itemsWithStatus = progressData.filter(item => item[configure.rowId] === status);

let count = 0;
// Now, you have an array of items with the same status, so you can loop through them and add their values to 'count'
for (const item of itemsWithStatus) {
  count += item[configure.valueId];
}

  return (
    <Button  style={{marginLeft:"10px"}} shape="round" key={status}>
      <Badge size="large" color={getColor[status] || "#CCCCCC"} />
      &nbsp;
      <Text strong>({count})</Text>&nbsp;
      <Text type="secondary">{status}</Text>
    </Button>
  );
})}


            {/* </div> */}
      
      </Space>
      <br/>
      
         </Card>
        
       </Col>
 
 
    
      </Row>
       </>


 
  );
};

export { ProgressComponent };
