import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import eventService from '../../services/event.service';

const EventsPage = () => {


    return (

        <>
            EventsPage
            {console.log(events)}
        </>
    )
}

export default EventsPage