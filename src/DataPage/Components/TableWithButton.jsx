import React from "react";

import { BaseTable } from "./BaseTable";

export const TableWithButton = (buttonCallback, buttonText, tableProps) =>
    <div>
       <button onClick = {buttonCallback}>{buttonText}</button>
       <BaseTable tableProps = {tableProps}/>
    </div>
