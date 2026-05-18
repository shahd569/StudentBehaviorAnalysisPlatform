import Cards from "../../../components/recommendationCards"
import List from "@/components/recommendationsList"
import PredictiveList from "@/components/predictiveRecommendations"
export default function Recommendations() {
    return(
        <div style={{display:"flex", flexDirection:"column", gap:"20px", padding:"20px"}}> 
           <div>
            <h1 style={{ fontWeight: "bold" }}>التوصيات</h1>
           <p
             style={{
             fontSize: "18px",
             fontWeight: "bold",
             color: "gray",
             }}
      >
             تحليل أداء الطلاب وتوصيات مخصصة لتحسين نتائجهم
            </p>
           </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <Cards></Cards>
            </div>
            <div style={{display:"flex", gap:"30px"}}>
                <List></List>
                <PredictiveList></PredictiveList>
            </div>           
        </div>
    )
}