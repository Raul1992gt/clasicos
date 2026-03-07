import Link from "next/link";

export default function AvisoLegalPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">Aviso legal</h1>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">1. Identificación del titular</h2>
        <p className="text-muted">
          En cumplimiento con la normativa vigente, se informa de que el presente sitio web
          pertenece a:
        </p>
        <p className="text-muted">
          Responsable: [Nombre de la asociación, club o persona responsable]
          <br />
          NIF/CIF: [NIF o CIF si aplica]
          <br />
          Domicilio: [Dirección o localidad]
          <br />
          Email de contacto: [correo electrónico]
        </p>
        <p className="text-muted">
          Este sitio web tiene como finalidad facilitar la inscripción de participantes en
          el evento de vehículos clásicos organizado por el titular.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">2. Condiciones de uso</h2>
        <p className="text-muted">
          El acceso y uso de esta página web atribuye la condición de usuario e implica la
          aceptación de las presentes condiciones de uso.
        </p>
        <p className="text-muted">
          El usuario se compromete a utilizar el sitio web de forma adecuada y a no emplearlo
          para realizar actividades contrarias a la legislación vigente, la buena fe o el
          orden público.
        </p>
        <p className="text-muted">
          El titular del sitio web se reserva el derecho de modificar en cualquier momento
          los contenidos del sitio web, así como de suspender temporalmente el acceso al mismo
          sin previo aviso cuando resulte necesario.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">3. Responsabilidad</h2>
        <p className="text-muted">
          El titular del sitio web no se hace responsable de los posibles daños o perjuicios
          derivados del uso de la información contenida en esta página web.
        </p>
        <p className="text-muted">
          Asimismo, la organización del evento no se hace responsable de los daños materiales
          o personales que pudieran producirse durante la celebración del evento. Cada
          participante será responsable de su vehículo y de su comportamiento durante el
          mismo, declarando que el vehículo inscrito cumple con la normativa vigente y
          dispone de la documentación y seguro obligatorios en vigor.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">4. Protección de datos</h2>
        <p className="text-muted">
          Los datos personales recogidos a través de los formularios de este sitio web serán
          tratados conforme a la normativa vigente en materia de protección de datos,
          incluyendo el <strong>RGPD</strong> y la <strong>LOPDGDD</strong>.
        </p>
        <p className="text-muted">
          La finalidad del tratamiento de los datos es gestionar la inscripción de los
          participantes en el evento. Determinados datos, como el nombre del participante y
          el vehículo inscrito, podrán mostrarse públicamente en la lista de participantes
          del evento.
        </p>
        <p className="text-muted">
          Para más información sobre el tratamiento de datos personales, consulte la página
          de Política de Privacidad.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">5. Propiedad intelectual</h2>
        <p className="text-muted">
          Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos y
          diseño, están protegidos por la normativa de propiedad intelectual e industrial.
        </p>
        <p className="text-muted">
          Queda prohibida la reproducción, distribución o modificación total o parcial de
          los contenidos de este sitio web sin la autorización expresa del titular.
        </p>
      </section>

      <div className="pt-4">
        <Link href="/" className="text-xs underline text-muted">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}