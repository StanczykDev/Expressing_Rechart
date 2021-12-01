import React, {useEffect} from "react";

import { BaseTable } from "./BaseTable";

export const TableWithButton = ({ buttonCallback, buttonText, tableProps }) => {

   return <div>
        <button onClick={buttonCallback}>{ buttonText }</button>
        {/*<BaseTable tableProps={tableProps}/>*/}
    </div>
}
