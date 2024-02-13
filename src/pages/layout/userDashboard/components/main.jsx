export default function Main(props){
    return(
    <main className='bg_color_2'>
        <h3 className='titre_page'>{props.titrePage}</h3>
        {props.showPage}
    </main>
  );
}