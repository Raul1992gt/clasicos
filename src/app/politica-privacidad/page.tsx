import Link from "next/link";

export default function PoliticaPrivacidadPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">Política de Privacidad</h1>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">1. Responsable del tratamiento</h2>
        <p className="text-muted">
          Responsable: ASOC DE CLASICOS &gt;25 ESQUIVIAS
          <br />
          CIF: G75935197
          <br />
          Domicilio: CALLE MALVAR, NUM 17
          <br />
          Teléfono de contacto: 611 96 27 01
        </p>
        <p className="text-muted">
          El responsable del tratamiento garantiza la protección de los datos personales
          facilitados por los usuarios conforme a la normativa vigente en materia de
          protección de datos.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">2. Datos personales recogidos</h2>
        <p className="text-muted">
          A través del formulario de inscripción al evento se pueden recoger los siguientes
          datos personales:
        </p>
        <ul className="list-disc pl-5 text-muted">
          <li>Nombre y apellidos</li>
          <li>Teléfono</li>
          <li>Marca y modelo del vehículo</li>
          <li>Año de fabricación del vehículo</li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">3. Finalidad del tratamiento</h2>
        <p className="text-muted">
          Los datos personales facilitados serán utilizados exclusivamente para:
        </p>
        <ul className="list-disc pl-5 text-muted">
          <li>Gestionar la inscripción en el evento de vehículos clásicos</li>
          <li>Contactar con los participantes en caso necesario en relación con el evento</li>
          <li>Organizar la participación de los vehículos inscritos</li>
        </ul>
        <p className="text-muted">
          La base legal para el tratamiento de los datos es el consentimiento del usuario
          otorgado al enviar el formulario de inscripción y aceptar la presente política
          de privacidad.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">4. Datos que pueden mostrarse públicamente</h2>
        <p className="text-muted">
          Con el fin de informar sobre los participantes del evento, el nombre y apellidos
          del participante junto con el vehículo inscrito (marca y modelo) podrán aparecer
          en una lista pública de participantes dentro de esta web o en materiales
          relacionados con el evento.
        </p>
        <p className="text-muted">
          El teléfono u otros datos de contacto no serán publicados ni compartidos
          públicamente.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">5. Fotografías del evento</h2>
        <p className="text-muted">
          Durante el evento podrán realizarse fotografías o vídeos con fines de difusión
          del propio evento en la página web o redes sociales de la organización.
        </p>
        <p className="text-muted">
          Las imágenes se realizarán principalmente del ambiente del evento y de los
          vehículos participantes. En la medida de lo posible, las matrículas de los
          vehículos podrán ser ocultadas o difuminadas en las imágenes publicadas.
        </p>
        <p className="text-muted">
          Si alguna persona desea solicitar la retirada de una imagen en la que aparezca,
          podrá hacerlo contactando a través del correo electrónico indicado en esta
          política de privacidad.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">6. Conservación de los datos</h2>
        <p className="text-muted">
          Los datos personales se conservarán únicamente durante el tiempo necesario para
          gestionar la inscripción y la organización del evento, pudiendo ser eliminados
          posteriormente cuando ya no sean necesarios para dicha finalidad.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-base font-medium">7. Derechos de los usuarios</h2>
        <p className="text-muted">
          Los usuarios pueden ejercer en cualquier momento sus derechos de:
        </p>
        <ul className="list-disc pl-5 text-muted">
          <li>Acceso a sus datos personales</li>
          <li>Rectificación de datos incorrectos</li>
          <li>Supresión de sus datos</li>
          <li>Limitación u oposición al tratamiento</li>
        </ul>
        <p className="text-muted">
          Para ejercer estos derechos, el usuario puede contactar mediante el correo
          electrónico: [correo electrónico].
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