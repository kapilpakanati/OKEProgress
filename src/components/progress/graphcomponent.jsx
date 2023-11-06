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
const { Text, Link, Title } = Typography;


const DemoTinyArea =  () => {
    var kf = window.kf;
    var data_api;
     
    //   kf.api("https://development-work.kissflow.com/form-report/2/Ac5RzaoSc51T/Overall_Progress_A00/Overall_Progress_A01?_application_id=PMS_A00&$objective_owner_email=eugene@kissflow.com")
    //   .then((result) => {
        
    //     data_api = result;
    //     console.log("data_api_1", data_api);
    //     for (let j in data_api.Columns) {
    //       let colval = data_api.Columns[j];
    //       if (colval.FieldId == "Overall_Progress") {
    //         col_overall_progress = colval.Id;
    //         console.log("col_overall_progress", col_overall_progress);
    //       }
    //     }
    //    //const data = data_api.Data.map((item) => item[col_overall_progress]);
   
    //     //
  
    //   })

      const data = [97.4,92.1,81.6,71.1,97.4]
      console.log("datadata_2",data)
        const config = {
          height: 60,
          width: 80,
          autoFit: false,
          data,
          smooth: true,
          areaStyle: {
            fill: 'l(270) 0:#ffffff 0.5:#4AA147 1:#4AA147',
            fillOpacity: 0.4,
          },
          line: { color: '#4AA147' },
        };
  
        console.log("datadata_3",data)
        return <TinyArea {...config} />;
  
     
  
   
    
  };

  export default DemoTinyArea;